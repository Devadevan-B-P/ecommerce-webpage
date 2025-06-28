const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'cod'],
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardDetails: {
    number: { type: String }, // hashed
    cvv: { type: String }     // hashed
  },
  upiDetails: {
    id: { type: String }      // hashed
  },
  netBankingDetails: {
    bank: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
