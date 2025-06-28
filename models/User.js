const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,        // 👈 Add this
  email: String,
  password: String,
  isAdmin: Boolean
});

module.exports = mongoose.model('User', userSchema);
