var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    commentDate: {type: String, default: Date.now()}
});

module.exports = mongoose.model('Comment', commentSchema);