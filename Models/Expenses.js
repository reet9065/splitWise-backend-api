const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    payerEmail:{
        type:String,
        required:true
    },
    expensesName:{
        type:String,
        required:true
    },
    totalAmount:{
        type:Number,
        default:0,
        min:0
    },
    splitType:{
        type:String,
        enum:['exact', 'equal', 'percentage'],
        default:'equal'
    },
    description:{
        type:String,
        default:'No description'
    },
    participants:[{
        email:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            default:0,
        }
    }],
    upDateEnteries:{
        type:[mongoose.SchemaType.ObjectId],
        ref:'Enteries'
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);