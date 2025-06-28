const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();

const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/User'); // Needed to get user email
const sendEmail = require('../utils/sendEmail'); // ✅ Email utility

function generateOrderId() {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

router.post('/', async (req, res) => {
  try {
    const { productId, paymentMode, cardNumber, cvv, upiId, bankName } = req.body;
    const userId = req.session.userId;

    if (!userId || !productId || !paymentMode) {
      return res.status(400).json({ message: 'Missing fields or not logged in' });
    }

    let hashedCard = null, hashedCVV = null, hashedUPI = null;

    if (paymentMode === 'card') {
      if (!cardNumber || !cvv) return res.status(400).json({ message: 'Missing card details' });
      hashedCard = await bcrypt.hash(cardNumber, 10);
      hashedCVV = await bcrypt.hash(cvv, 10);
    } else if (paymentMode === 'upi') {
      if (!upiId) return res.status(400).json({ message: 'Missing UPI ID' });
      hashedUPI = await bcrypt.hash(upiId, 10);
    } else if (paymentMode === 'netbanking') {
      if (!bankName) return res.status(400).json({ message: 'Missing bank name' });
    }

    const newOrder = new Order({
      orderId: generateOrderId(),
      productId,
      paymentMode,
      customerId: new mongoose.Types.ObjectId(userId),
      cardDetails: hashedCard ? { number: hashedCard, cvv: hashedCVV } : undefined,
      upiDetails: hashedUPI ? { id: hashedUPI } : undefined,
      netBankingDetails: bankName ? { bank: bankName } : undefined
    });

    const savedOrder = await newOrder.save();

    const product = await Product.findById(productId).lean();
    const productName = product ? product.name : "Unknown Product";

    const user = await User.findById(userId).lean();
    const userEmail = user ? user.email : null;

    // ✅ Send email if user email is available and verified
    if (userEmail) {
      const subject = '🛒 Order Confirmation';
      const message = `Hello ${user.name},\n\nYour order for "${productName}" has been placed successfully!\n\nOrder ID: ${savedOrder.orderId}\nPayment Mode: ${paymentMode}\n\nThank you for shopping with us!`;

      try {
        await sendEmail(userEmail, subject, message);
        console.log('✅ Order confirmation email sent to:', userEmail);
      } catch (emailError) {
        console.error('❌ Failed to send order confirmation email:', emailError);
      }
    }

    res.status(201).json({
      orderId: savedOrder.orderId,
      productId: savedOrder.productId,
      productName,
      paymentMode: savedOrder.paymentMode
    });

  } catch (err) {
    console.error('❌ Order save failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
