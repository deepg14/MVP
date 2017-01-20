var mongoose = require('mongoose');

// TODO: Fill out the userSchema.
// Hint: a user is an object such as
//     {'username': 'Isaac', 'favoriteFruit': 'apple'}

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	name: String,
	phone: String,
	email: String,
	about: String
});
//

// var userSchema = null;

var User = mongoose.model('User', userSchema);

module.exports = User;
