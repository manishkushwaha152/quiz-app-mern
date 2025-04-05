const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const { ObjectId } = require('mongoose').Types;

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-questions.options.isCorrect');
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.options.isCorrect');
    
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.status(500).send('Server error');
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    const { answers } = req.body;
    let score = 0;

    // Validate answers
    const processedAnswers = answers.map(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      if (!question) {
        throw new Error(`Question with ID ${answer.questionId} not found`);
      }

      const selectedOption = question.options.find(
        opt => opt._id.toString() === answer.selectedOptionId
      );
      if (!selectedOption) {
        throw new Error(`Option with ID ${answer.selectedOptionId} not found in question ${answer.questionId}`);
      }

      const isCorrect = selectedOption.isCorrect;
      if (isCorrect) {
        score += question.points || 1;
      }

      return {
        questionId: question._id,
        selectedOption: selectedOption._id,
        isCorrect
      };
    });

    // Save result
    const result = new Result({
      quiz: quiz._id,
      user: req.user.id,
      score,
      totalQuestions: quiz.questions.length,
      answers: processedAnswers
    });

    await result.save();

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      answers: processedAnswers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};