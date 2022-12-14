const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.set('strictQuery', false);

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//this line below adds username, hash and salt field to store the username, the hashed password and the salt value.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);