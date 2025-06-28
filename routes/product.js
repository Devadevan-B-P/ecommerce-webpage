const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get one product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

module.exports = router;
