const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase: true
    },
    phone:{
        type:String,
        unique:true,
        minLength:[10,"The phone number should at list 10 charecters"],
        maxLength:[10,"The phone number should not greater then 10 Charecters"],
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})

const User = mongoose.model('User',userSchema);
module.exports = User;  //exporting the model to be used in other files.  //