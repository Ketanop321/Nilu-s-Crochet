import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Authentication middleware
// @access  Private
export const auth = async (req, res, next) => {
  try {
    // Get token from header or cookies
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Get token from cookie
      token = req.cookies.token;
    }

    // Check if no token
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No authentication token, authorization denied' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      // Add user to request object
      req.user = user;
      next();
      
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, token verification failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Admin middleware (must be used after auth middleware)
// @access  Private/Admin
export const admin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Admin access required' 
      });
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Role-based access control middleware
// @access  Private
export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Authentication required' 
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false,
          message: `User role ${req.user.role} is not authorized to access this route` 
        });
      }
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error during authorization',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};
