import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Import models
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'nilu-crochet-secret-key-2024';
const MONGODB_URI = process.env.MONGODB_URI;
const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY;

console.log('🔧 Environment Check:');
console.log('MongoDB URI:', MONGODB_URI ? 'Configured ✅' : 'Missing ❌');
console.log('MailerSend API:', MAILERSEND_API_KEY ? 'Configured ✅' : 'Missing ❌');
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Configured ✅' : 'Missing ❌');

// Initialize services
const mailerSend = new MailerSend({ apiKey: MAILERSEND_API_KEY });
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Connect to MongoDB
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
const uploadsDir = process.env.UPLOAD_PATH || join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Initialize admin user
const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        email: 'admin@nilucrochet.com',
        password: 'admin123',
        role: 'admin',
        profile: {
          full_name: 'Nilu Admin'
        },
        emailVerified: true
      });
      await admin.save();
      console.log('✅ Default admin user created');
      console.log('👑 Admin login: username=admin, password=admin123');
    } else {
      console.log('✅ Admin user already exists');
      console.log('👑 Admin login: username=admin, password=admin123');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Nilu Crochet API is running!', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    status: 'healthy'
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const stats = {
      users: await User.countDocuments(),
      products: await Product.countDocuments(),
      orders: await Order.countDocuments()
    };
    
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, full_name, phone, address } = req.body;
    
    console.log('📝 Registration attempt:', { username, email, full_name });
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      profile: {
        full_name: full_name || '',
        phone: phone || '',
        address: address ? {
          street: address,
          city: '',
          state: '',
          pincode: ''
        } : undefined
      }
    });

    await user.save();
    console.log('✅ User registered successfully:', user.username);
    
    const token = jwt.sign(
      { id: user._id, username, email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔐 Login attempt:', username);
    
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    console.log('✅ Login successful:', user.username, 'Role:', user.role);
    
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth login
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    let user = await User.findOne({ 
      $or: [{ googleId }, { email }] 
    });
    
    if (user) {
      // Update Google ID if user exists with email
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      const username = email.split('@')[0] + Math.random().toString(36).substr(2, 4);
      user = new User({
        username,
        email,
        googleId,
        profile: {
          full_name: name,
          avatar: picture
        },
        emailVerified: true
      });
      await user.save();
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('❌ Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1, 
      limit = 20 
    } = req.query;
    
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'description.short': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (minPrice || maxPrice) {
      filter['price.regular'] = {};
      if (minPrice) filter['price.regular'].$gte = Number(minPrice);
      if (maxPrice) filter['price.regular'].$lte = Number(maxPrice);
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'username');
    
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Dashboard stats (admin only)
app.get('/api/dashboard/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.find()
        .populate('customer', 'username profile.full_name')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);
    
    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large' });
    }
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 Nilu' Crochet Server Started Successfully!`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Test API: http://localhost:${PORT}/api/test`);
  console.log(`📧 MailerSend: ${MAILERSEND_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
  console.log(`🔐 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured ✅' : 'Missing ❌'}`);
  
  // Initialize admin user
  await initializeAdmin();
  
  console.log(`\n🎯 Ready for connections!`);
});