const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
const Product = require('../models/product'); // ✅ Import model
dotenv.config();

// ✅ Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// ✅ Multer + S3 setup
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

// ✅ Upload route
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, specs } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: '❌ No image uploaded' });
    }

    const imageUrl = req.file.location;

    const product = new Product({
      name,
      price,
      description,
      specs: specs.split('\n'),
      image: imageUrl
    });

    await product.save();

    res.status(200).json({ message: '✅ Product uploaded', product });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ message: '❌ Failed to upload product' });
  }
});

// ✅ Delete a product and its image from S3
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  try {
    // Extract key from image URL
    const imageKey = decodeURIComponent(imageUrl.split('/').pop());

    // Delete image from S3
    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
      })
      .promise();

    // Delete product from DB
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: '🗑️ Product deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ message: '❌ Failed to delete product' });
  }
});


// ✅ Get all products
router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;
