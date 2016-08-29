var mongoose = require('mongoose');

// SCHEMA SETUP:
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

// mongoose will name our var "camps" in the DB (lowercase, plural)
module.exports = mongoose.model('Camp', campSchema); // export for external file
