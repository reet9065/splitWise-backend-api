const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // OTP expires in 10 minutes (600 seconds)
      },
})
const otp = mongoose.model('otp', otpSchema);
module.exports = otp;

