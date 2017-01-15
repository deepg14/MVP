var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name: String,
	course: Number

});

var User = mongoose.model('User', userSchema);

module.exports = User;