// routes/contact.js
const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return next();
  res.status(401).json({ message: 'Unauthorized' });
}

router.post('/', isAuthenticated, async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      userId: req.session.userId
    });

    await contact.save();
    res.json({ message: 'Message submitted successfully!' });
  } catch (err) {
    console.error('❌ Error saving contact:', err);
    res.status(500).json({ message: 'Failed to submit message' });
  }
});

module.exports = router;
// Check if contact info exists for logged-in user
router.get('/check', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ hasContact: false, message: 'Unauthorized' });
  }

  Contact.findOne({ userId: req.session.userId })
    .then(contact => {
      if (contact) res.json({ hasContact: true });
      else res.json({ hasContact: false });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ hasContact: false, message: 'Server error' });
    });
});
