const mongoose = require('mongoose');

const JwtSchema = new mongoose.Schema({
     token: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 864000, // OTP expires in 10 days (864000 seconds)
      },
})
const Jwt = mongoose.model('JwtToken', JwtSchema);
module.exports = Jwt;
