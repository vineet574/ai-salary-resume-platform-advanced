const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, required: true },
    resumeText: { type: String, required: true },
    matchedKeywords: [String],
    missingKeywords: [String],
    score: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
