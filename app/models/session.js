﻿// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var sess = mongoose.Schema({
    
    sessions : {
        email        : String,
        password     : String,
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
