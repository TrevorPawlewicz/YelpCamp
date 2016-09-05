// ALL our MIDDLEWARE from comment.js, campgrounds.js & index.js --------------
var Camp       = require('../models/campground.js'); // import model
var Comment    = require('../models/comment.js');    // import model

var middlewareObj = {}; // our functions will go here and then exported


middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}; //--------------------------------------------------------------------------

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect('back');
            } else {
                // equals = mongoose mathod to compare
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}; //--------------------------------------------------------------------------

middlewareObj.checkCampOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Camp.findById(req.params.id, function(err, foundCamp){
            if (err) {
                res.redirect('back');
            } else {
                // equals = mongoose mathod to compare
                if (foundCamp.author.id.equals(req.user._id)) {
                    console.log("moving on...");
                    next();
                } else {
                    console.log("Denied! Going back...");
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}; //--------------------------------------------------------------------------


// export our middleware object for use in other routes:
module.exports = middlewareObj;

//=============================================================================
