const mongoose = require('mongoose');

const institutionschema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:[true, "Email is required"],
        match:[/.+@.+\..+/, "please enter a valid email"]
    },

    password:{
        type:String,
        required:[true, "Password is required"]
    }
});

module.exports = mongoose.model('institution', institutionschema);