const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const quizController = require('../controllers/quiz');

// @route   GET api/quiz
// @desc    Get all quizzes
// @access  Private (both admin and student)
router.get('/', auth, quizController.getAllQuizzes);

// @route   GET api/quiz/:id
// @desc    Get single quiz
// @access  Private (both admin and student)
router.get('/:id', auth, quizController.getQuizById);

// @route   POST api/quiz/submit/:id
// @desc    Submit quiz answers
// @access  Private (student)
router.post('/submit/:id', auth, quizController.submitQuiz);

module.exports = router;