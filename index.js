require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const User = require('./Models/UserSchema')
const SendEmail = require('./Services/otpSender');
const otpverifier = require('./Services/otpverifier');
const ExpenseRoutes = require('./routes/ExpenseRoutes')


// allowing server to accept json 
app.use(express.json());

app.use('/api/expenses', ExpenseRoutes);

app.get('/',async(req,res)=>{
    try {
        const otp = await SendEmail("OTP verification",process.env.TO_EMAIL);
    } catch (error) {
        console.log(error);
    }
    res.send('Hello World!');
})

app.post('/CreateUser', async(req,res)=>{
    try {
        const {name,email,phone} = req.body;

        // Checking if the email or phone already exist in database
        const EmailAllreadyExist = await User.find({email:email, isVerified:true});
        const PhoneAllreadyExist = await User.find({phone:phone, isVerified:true});

        // Sending bad Respons if the email already exist
        if(EmailAllreadyExist.length > 0){
            res.status(400).json({"Error":"Email already exist"});

         // Sending bad Respons if the email already exist  
        }else if(PhoneAllreadyExist.length > 0){
            res.status(400).json({"Error":"Phone number already exist"});

         // Saving user to the data base if user is uniqe   
        }else{
            const user = new User({name,email,phone});
            await user.save();
            const EmailSended = await SendEmail("Otp verification",email);
            res.status(201).json({"message": `Otp link sent to your email : ${EmailSended.email}, Please verify your email`, 
                                });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({"Error":error.message});
        
    }
})

app.get('/verifyemail',async(req,res)=>{
    try {
        const {otp_id,otp} = req.query;
        const verifier = await otpverifier(otp_id,otp);
        console.log(verifier);
        if(verifier){
            res.status(200).json({"message":"Email verified successfully","Session_token_id":`${verifier.token}`});
        }else{
            res.status(400).json({"Error":"Invalid otp","message":"otp link may expired please try again"});
        }

    } catch (error) {
        console.log(error);
    }
})



// The serve only runs when the DB is connected sucssecfully
mongoose.connect(process.env.DB_CONNECT_URL)
.then(() => {
    app.listen(process.env.PORT,()=>{
        console.log(`DB connected and Server is listning on port : ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log(error);
})




