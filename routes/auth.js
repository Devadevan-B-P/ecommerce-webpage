const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

// ✅ Rate limiter for login route (skips ELB HealthChecker)
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: '⚠️ Too many login attempts. Please try again after 5 minutes.',
  skip: (req, res) => req.get('user-agent')?.includes('ELB-HealthChecker')
});

// ✅ Signup Route
router.post('/signup', [
  body('name').trim().escape().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'Signup successful' });
});

// ✅ Login Route with updated rate limiter
router.post('/login', loginLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body('password').trim().notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      req.session.userId = user._id;
      req.session.userName = user.name;
      req.session.isAdmin = user.isAdmin || false;

      return res.status(200).json({
        message: 'Login successful',
        isAdmin: user.isAdmin || false
      });
    }
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

// ✅ Logout Route
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// ✅ Save contact form
router.post('/contact', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

  const { name, email, message } = req.body;
  const contact = new Contact({
    name,
    email,
    message,
    userId: req.session.userId
  });

  await contact.save();
  res.status(200).json({ message: 'Contact saved' });
});

// ✅ Fetch user-specific contacts
router.get('/mycontacts', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });

  const contacts = await Contact.find({ userId: req.session.userId });
  res.status(200).json(contacts);
});

// ✅ Session check route (optional)
router.get('/me', (req, res) => {
  res.json({
    userId: req.session.userId || null,
    isAdmin: req.session.isAdmin || false
  });
});

// ✅ Get name of logged-in user
router.get('/user-info', async (req, res) => {
  if (!req.session.userId) return res.json({ name: null });

  const user = await User.findById(req.session.userId);
  if (!user) return res.json({ name: null });

  res.json({ name: user.name });
});

module.exports = router;
