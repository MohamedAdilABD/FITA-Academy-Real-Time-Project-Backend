const mongoose = require('mongoose');

const userschema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Enter your name"]
    },

    email:{
        type:String,
        unique:true,
        required:[true, "Email is required"],
        match:[/.+@.+\..+/, "Please enter a valid email"]
    },

    phone:{
        type:Number,
        min:[1000000000, "Phone no is invalid"]
    },

    qualification:{
        type:String,
        required:[true, "Qualification is required"]
    },

    passingoutyear:{
        type:String,
        required:[true, "Passing out year is required"]
    },

    resume:{
        type:String
    },

    course:{
        type:String,
        required:[true, "Course is required"]
    },

    experience:{
        type:String,
        required:[true, "Experirnce is required"]
    },

    position:{
        type:String,
        required:[true, "postion is required"]
    },

    portfoliolink:{
        type:String
    },

    photo:{
        type:String
    },

    created:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model('userdata', userschema);