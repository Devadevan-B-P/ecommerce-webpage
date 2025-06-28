const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  specs: [String],
  image: String,
});

module.exports = mongoose.model('Product', productSchema);
