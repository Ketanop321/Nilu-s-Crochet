import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { auth, authorize } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', register);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', login);

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', auth, getMe);

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
