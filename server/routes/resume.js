const express = require('express');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const auth = require('../middleware/auth');

const router = express.Router();

// Simple weighted keyword sets per role
const ROLE_KEYWORDS = {
  'data scientist': {
    core: ['python', 'machine learning', 'statistics', 'pandas', 'numpy', 'scikit-learn'],
    tooling: ['sql', 'data visualization', 'jupyter', 'git'],
    advanced: ['deep learning', 'tensorflow', 'pytorch', 'mlops']
  },
  'full stack developer': {
    core: ['javascript', 'react', 'node', 'express', 'mongodb'],
    frontend: ['html', 'css', 'tailwind', 'typescript'],
    backend: ['rest api', 'jwt', 'docker', 'testing']
  },
  'data analyst': {
    core: ['excel', 'sql', 'reporting', 'dashboards'],
    bi: ['tableau', 'power bi', 'lookerstudio'],
    stats: ['a/b testing', 'hypothesis testing']
  }
};

// weights for each category
const CATEGORY_WEIGHTS = {
  core: 0.5,
  tooling: 0.2,
  advanced: 0.3,
  frontend: 0.3,
  backend: 0.3,
  bi: 0.3,
  stats: 0.2
};

router.post('/analyze', auth, async (req, res) => {
  try {
    const { targetRole, resumeText } = req.body;
    if (!targetRole || !resumeText) {
      return res.status(400).json({ message: 'targetRole and resumeText are required' });
    }

    const roleKey = targetRole.toLowerCase();
    const roleKeywords = ROLE_KEYWORDS[roleKey] || {};
    const text = resumeText.toLowerCase();

    const matchedKeywords = [];
    const missingKeywords = [];
    let score = 0;
    let maxScore = 0;

    Object.entries(roleKeywords).forEach(([category, keywords]) => {
      const weight = CATEGORY_WEIGHTS[category] || 0.2;
      const perKeywordWeight = keywords.length ? weight / keywords.length : 0;

      keywords.forEach((kw) => {
        maxScore += perKeywordWeight;
        if (text.includes(kw)) {
          matchedKeywords.push(kw);
          score += perKeywordWeight;
        } else {
          missingKeywords.push(kw);
        }
      });
    });

    const percentScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    const analysis = await ResumeAnalysis.create({
      user: req.user.userId,
      targetRole,
      resumeText,
      matchedKeywords,
      missingKeywords,
      score: percentScore
    });

    return res.json({ analysis });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
