const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const { ObjectId } = require('mongoose').Types;

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const quiz = new Quiz({
      title,
      description,
      questions,
      createdBy: req.user.id
    });

    await quiz.save();

    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Check if the user is the creator of the quiz
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this quiz' });
    }

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.questions = questions || quiz.questions;
    quiz.updatedAt = Date.now();

    await quiz.save();

    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Check if the user is the creator of the quiz
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this quiz' });
    }

    await quiz.remove();

    // Also delete all results associated with this quiz
    await Result.deleteMany({ quiz: quiz._id });

    res.json({ msg: 'Quiz deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all quiz results
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('quiz', 'title')
      .populate('user', 'name email');
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get results for a specific quiz
exports.getQuizResults = async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate('user', 'name email');
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};