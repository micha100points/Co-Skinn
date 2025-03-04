// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UserID: Number,
  Username: String,
  Password: String, // Mật khẩu nên được mã hóa
  Email: { type: String, required: true, unique: true },
  Phone: String,
  Address: String,
  Role: String,
  CreatedAt: { type: Date, default: Date.now },
  Status: { type: String, default: 'Active' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
