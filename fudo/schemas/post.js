var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	postTitle: String,
	postAuthor: String
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
