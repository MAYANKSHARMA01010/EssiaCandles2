const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

// ✅ JWT Auth Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user data to request
    next();
  } 
  catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// 🔐 Signup Route
router.post('/signup', async (req, res) => {
  console.log('👉 POST /signup called');
  console.log('🟡 Request body', req.body);

  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } 
  catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔐 Login Route
router.post('/login', async (req, res) => {
  console.log('👉 POST /login called');
  console.log('🟡 Request body', req.body);

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } 
  catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔒 Protected Route (requires valid JWT token)
router.get('/protected', authenticate, (req, res) => {
  res.status(200).json({
    message: '✅ You have accessed a protected route!',
    user: req.user,
  });
});

// Test route to verify user routes are working
router.get('/test', (req, res) => {
  res.send('✅ User route working!');
});

module.exports = router;
