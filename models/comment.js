var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text: String,
    author: String
});

// export as a mongoose compiled model
module.exports = mongoose.model('Comment', commentSchema);
