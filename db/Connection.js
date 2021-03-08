const mongoose = require('mongoose');

const URI = process.env.DB_CONNECTION;

const connectDB = async() => {
  await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('db connected');
};

module.exports = connectDB;