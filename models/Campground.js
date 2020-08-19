var mongoose = require('mongoose');

// Schema build
const campSchema = mongoose.Schema({
    name: String,
    image: String,
    description: {type: String, maxlength: 1500}
});

// Exporting model
module.exports = mongoose.model('Campground', campSchema);