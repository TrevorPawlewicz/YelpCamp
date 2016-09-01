// ============================ Comment MODEL ================================

var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // model we refer to
        },
        username: String
    }
});

// export as a mongoose compiled model
module.exports = mongoose.model('Comment', commentSchema);
