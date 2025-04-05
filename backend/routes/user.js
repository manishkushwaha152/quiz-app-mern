const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/user');

// @route   GET api/user/profile
// @desc    Get user profile
// @access  Private
// router.get('/profile', auth, userController.getProfile);
router.get('/', auth, userController.getProfile);


module.exports = router;