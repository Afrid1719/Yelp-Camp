var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentDate: 
    {
        type: String,
        default: Date.now()
    }
});

module.exports = mongoose.model('Comment', commentSchema);