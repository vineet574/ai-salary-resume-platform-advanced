const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    input: {
      years_experience: Number,
      education_level: Number,
      role_level: Number
    },
    result: {
      per_model: Object,
      ensemble: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', predictionSchema);
