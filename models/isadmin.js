const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false } // ✅ Add this
});

module.exports = mongoose.model('User', userSchema);
