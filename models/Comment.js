var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: mongoose.Schema.Types.ObjectId,
        name: String 
    },
    commentDate: 
    {
        type: String,
        default: Date.now()
    }
});

module.exports = mongoose.model('Comment', commentSchema);