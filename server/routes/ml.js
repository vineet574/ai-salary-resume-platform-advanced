const express = require('express');
const { spawn } = require('child_process');
const Prediction = require('../models/Prediction');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.post('/salary', auth, async (req, res) => {
  const { years_experience, education_level, role_level, company_size = 1, model } = req.body;

  const features = { years_experience, education_level, role_level, company_size };
  const pythonBin = process.env.PYTHON_BIN || 'python';

  // UPDATED PATH (only this line changed)
  const scriptPath = path.join(__dirname, '..', 'ml', 'predict.py');

  const args = [scriptPath, JSON.stringify(features)];
  if (model) {
    args.push(model);
  }

  const child = spawn(pythonBin, args);

  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });

  let errorOutput = '';
  child.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  child.on('close', async (code) => {
    if (code !== 0 && !output) {
      return res.status(500).json({ message: 'Python script error', error: errorOutput });
    }
    try {
      const parsed = JSON.parse(output);
      if (parsed.error) {
        return res.status(500).json({ message: parsed.error });
      }

      const prediction = await Prediction.create({
        user: req.user.userId,
        input: features,
        result: parsed
      });

      return res.json({ prediction });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to parse prediction output' });
    }
  });
});

// Expose model metrics to the dashboard
router.get('/metrics', auth, async (req, res) => {
  try {
    // UPDATED PATH HERE TOO
    const metricsPath = path.join(__dirname, '..', 'ml', 'model_metrics.json');

    if (!fs.existsSync(metricsPath)) {
      return res.status(404).json({ message: 'Metrics not found. Train models first.' });
    }
    const raw = fs.readFileSync(metricsPath, 'utf-8');
    const metrics = JSON.parse(raw);
    return res.json(metrics);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load model metrics' });
  }
});

module.exports = router;
