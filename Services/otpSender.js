const result = require('dotenv').config();
const OtpSchema = require('../Models/Otp');
const nodemailer = require('nodemailer');

const htmlgen = (verification_url) => {
    return(
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #333333;
        }
        .otp {
            font-size: 24px;
            color: #ff6f61;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .content {
            color: #666666;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #999999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email</h1>
        </div>
        <div class="content">
            <p>Dear User,</p>
            <p>Thank you for registering with us. Please use the following One-Time Password link (OTPL) to complete your verification process:</p>
            <div class="otp"><a href=${verification_url} target="_blank">${verification_url}</a></div>
            <p>This OTP Link is valid for 10 minutes. Do not share it with anyone.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `
    )
}

// Create a Nodemailer transporter using either SMTP 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.HOST_USER,
        pass: process.env.HOST_PASSWORD
    }
})
// This function can send massages to users
async function SendEmail(Email_Subject,Send_to_Email){
    try {
        // cheking if already any otp exist in database for same email
        const otp_count = await OtpSchema.find({email:SendEmail});
        if(otp_count.length > 0){
            // if otp exist then delete it
            await OtpSchema.deleteOne({email:SendEmail});
        }
        // if otp not exist then create a new otp
        const otpdigits = Math.floor(1000 + Math.random() * 9000).toString();
        const otp = new OtpSchema({email:Send_to_Email,otp:otpdigits});
        const sendedOtp = await otp.save();

        //creating info for like subject, from, to and massage;
        const mailinfo ={
            from: process.env.HOST_USER,
            to: Send_to_Email,
            subject: Email_Subject,
            text: 'Hello From SplitWise 👋',
            html: htmlgen(`${process.env.SERVER_HOST}/verifyemail?otp_id=${sendedOtp._id}&otp=${otpdigits}`)
        }
        // sending the massage
        const respon = await transporter.sendMail(mailinfo);
        console.log(respon);

        return sendedOtp;

    } catch (error) {
        console.log(error);
    }
}

module.exports = SendEmail;

