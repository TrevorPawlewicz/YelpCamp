// ALL our MIDDLEWARE from comment.js, campgrounds.js & index.js --------------

var Camp       = require('../models/campground.js'); // import model
var Comment    = require('../models/comment.js');    // import model
var middleware = require('../middleware/middleware.js'); // index.js is default

var middlewareObj = {}; // our functions will go here and then exported


middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //  flash    key,   value - passed to res.locals.errorMessage (app.js)
    req.flash('error', 'You Need to Be Logged In To Do That.');
    res.redirect('/login');
}; //--------------------------------------------------------------------------

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                req.flash('error', 'Comment Not Found!');
                res.redirect('back');
            } else {
                // equals = mongoose method to compare
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You Do Not Have Permissions!');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You Need to Be Logged In To Do That.');
        res.redirect('back');
    }
}; //--------------------------------------------------------------------------

middlewareObj.checkCampOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Camp.findById(req.params.id, function(err, foundCamp){
            if (err) {
                req.flash('error', 'Camp Not Found!');
                res.redirect('back');
            } else {
                // equals = mongoose method to compare
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You Do Not Have Permissions!');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You Need to Be Logged In To Do That.');
        res.redirect('back');
    }
}; //--------------------------------------------------------------------------


// export our middleware object for use in other routes:
module.exports = middlewareObj;

//=============================================================================
