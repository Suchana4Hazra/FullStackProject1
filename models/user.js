const { required } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },

    //Passport-local-mongoose will add username,
    //hash and salt field to store the username,
    //the hashed password and the salt value
    //Thats why we don't need to consider username and password as separate field, passport-local mongoose handles these automatically

})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);
