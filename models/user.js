const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalmongoose = require("passport-local-mongoose");

const userSchima = new Schema({
    email:{
        type:String,
        required: true
    }
})

userSchima.plugin(passportLocalmongoose);

module.exports = mongoose.model('User', userSchima);