var mongoose = require('mongoose');

// Schema build
const campSchema = mongoose.Schema({
    name: {type: String, maxlength: 65},
    image: String,
    price: String,
    description: String,
    author: {
        id: mongoose.Schema.Types.ObjectId,
        name: String 
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

// Exporting model
module.exports = mongoose.model('Campground', campSchema);