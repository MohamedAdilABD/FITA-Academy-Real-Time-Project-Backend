const mongoose = require('mongoose');

const testschema = mongoose.Schema({

    name:{
        type:String,
        required:[true, "Enter your Name"]
    },

    course:{
        type:String,
        required:[true, "Enter your course"]
    },

    photo:{
        type:String,
        required:true
    },

    textarea:{
        type:String,
        required:[true, "Type your feedback"]
    },

    status:{
        type:Boolean,
        default:false
    }

});

module.exports = mongoose.model('testdata', testschema);