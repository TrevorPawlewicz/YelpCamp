var mongoose              = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose); // adds AUTH to our UserSchema

// export so app.js can access the UserSchema model
module.exports = mongoose.model('User', UserSchema);
