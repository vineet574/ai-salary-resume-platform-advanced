const express = require('express');
const Prediction = require('../models/Prediction');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [predictionCount, analysisCount, latestPrediction] = await Promise.all([
      Prediction.countDocuments({ user: userId }),
      ResumeAnalysis.countDocuments({ user: userId }),
      Prediction.findOne({ user: userId }).sort({ createdAt: -1 })
    ]);

    // Load model metrics for high-level view
    let modelSummary = null;
    try {
      // UPDATED PATH HERE
      const metricsPath = path.join(__dirname, '..', 'ml', 'model_metrics.json');

      if (fs.existsSync(metricsPath)) {
        const raw = fs.readFileSync(metricsPath, 'utf-8');
        const metrics = JSON.parse(raw);
        const { best_model, ...rest } = metrics;
        modelSummary = {
          bestModel: best_model || null,
          metrics: rest
        };
      }
    } catch (e) {
      console.error('Failed to read model metrics:', e);
    }

    return res.json({
      predictionCount,
      analysisCount,
      latestPrediction,
      modelSummary
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
