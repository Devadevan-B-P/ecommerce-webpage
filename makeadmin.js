const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User'); // adjust path if needed

mongoose.connect(process.env.MONGO_URI, { dbName: 'awswebpage' })
  .then(async () => {
    const result = await User.updateOne({ email: 'admin@123' }, { $set: { isAdmin: true } });
    console.log('✅ Admin rights granted:', result);
    process.exit();
  })
  .catch(err => {
    console.error('❌ Failed to update:', err);
    process.exit(1);
  });
