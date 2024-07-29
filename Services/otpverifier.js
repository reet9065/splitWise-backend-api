const result = require('dotenv').config();
const OtpSchema = require('../Models/Otp');
const JWTtoken = require("../Models/jwtToken");
const User = require('../Models/UserSchema')
const {SetUser} = require('./Token');

async function otpverifier(otp_id,otp){
    try {
        const check_otp = await OtpSchema.findById(otp_id);
        console.log(check_otp);
        if(!check_otp || check_otp.otp !== otp){
            return null
        }else{
            // updating the user IsAauthrized value
            const user = await User.findOneAndUpdate({email:check_otp.email},{isVerified:true});
            const jwt_tok = SetUser({_id:user._id, email:user.email, name:user.name, phone:user.phone});
            const JWT = new JWTtoken({token:jwt_tok,userId:user._id});
            // delete the otp
            await OtpSchema.findByIdAndDelete(otp_id);
            return await JWT.save();
        }
    } catch (error) {
        return null;
    }
}
module.exports = otpverifier;  // Export the function to be used elsewhere in the application.

