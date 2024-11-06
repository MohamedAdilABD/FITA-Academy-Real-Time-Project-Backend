const mongoose = require('mongoose');

const recruiterschema = mongoose.Schema({

    email:{
        type:String,
        unique:true,
        required:[true, "Email is required"],
        match: [/.+@.+\..+/, "please enter a valid email"]
    },

    password:{
        type:String,
        required:[true, "password is required"]
    }
});

module.exports = mongoose.model('recruiter', recruiterschema);