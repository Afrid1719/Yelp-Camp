var mongoose = require('mongoose');

// Schema build
const campSchema = mongoose.Schema({
    name: {type: String, maxlength: 65},
    image: String,
    description: {type: String, maxlength: 1500},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

// Exporting model
module.exports = mongoose.model('Campground', campSchema);