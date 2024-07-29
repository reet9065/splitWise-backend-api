const mongoose = require('mongoose');

const Enteries = new mongoose.Schema({
    enteries:{
        belongsTo:{
            type: mongoose.SchemaTypes.ObjectId,
            require:true
        },
        addedby:{
            type:String,
            required:true
        },
        thisTimeTotal:{
            type:Number,
            required:true
        },
        data:[{
            email:{
                type:String,
                required:true
            },
            amount:{
                type:Number,
                required:true,
                min:0
            }
        }]
    }
});

module.exports = mongoose.model('Enteries', Enteries);