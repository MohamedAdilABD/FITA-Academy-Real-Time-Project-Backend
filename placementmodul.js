const mongoose = require('mongoose');

const placementschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    placementcompany:{
        type:String,
        required:true
    },

    position:{
        type:String,
        required:true
    },

    course:{
        type:String,
        required:true
    },

    photo:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('placement', placementschema);