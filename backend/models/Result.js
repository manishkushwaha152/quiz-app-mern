const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedOption: mongoose.Schema.Types.ObjectId,
    isCorrect: Boolean
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', ResultSchema);