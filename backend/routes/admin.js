const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const adminController = require('../controllers/admin');
const { check } = require('express-validator');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  next();
};

// @route   POST api/admin/quiz
// @desc    Create a new quiz
// @access  Private (admin)
router.post(
  '/quiz',
  [
    auth,
    isAdmin,
    check('title', 'Title is required').not().isEmpty(),
    check('questions', 'At least one question is required').isArray({ min: 1 })
  ],
  adminController.createQuiz
);

// @route   PUT api/admin/quiz/:id
// @desc    Update a quiz
// @access  Private (admin)
router.put('/quiz/:id', [auth, isAdmin], adminController.updateQuiz);


// @route   DELETE api/admin/quiz/:id
// @desc    Delete a quiz
// @access  Private (admin)
router.delete('/quiz/:id', [auth, isAdmin], adminController.deleteQuiz);


// @route   GET api/admin/results
// @desc    Get all quiz results
// @access  Private (admin)
router.get('/results', [auth, isAdmin], adminController.getAllResults);

// @route   GET api/admin/results/:quizId
// @desc    Get results for a specific quiz
// @access  Private (admin)
router.get('/results/:quizId', [auth, isAdmin], adminController.getQuizResults);

module.exports = router;