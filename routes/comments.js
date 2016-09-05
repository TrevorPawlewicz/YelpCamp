// ====================== CommentS ROUTES =====================================

var express = require('express');
var router  = express.Router({mergeParams: true}); // combine Comment & Camp
var Camp    = require('../models/campground.js'); // import model
var Comment = require('../models/comment.js');    // import model

//                                             MIDDLEWARE
// router.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
router.get('/new', isLoggedIn, function(req, res){
    // find by ID
    Camp.findById(req.params.id, function(err, foundCamp){
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new.ejs', {campData: foundCamp});
        }
    });
}); //-------------------------------------------------------------------------
//                                          MIDDLEWARE
// router.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
router.post('/', isLoggedIn, function(req, res){
    //
    Camp.findById(req.params.id, function(err, foundCamp){
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                    res.redirect('/campgrounds');
                } else {
                    // taken from of comment.js commentSchema:
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log("comment = " + comment);

                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    console.log("foundCamp = " + foundCamp);

                    res.redirect('/campgrounds/' + foundCamp._id);
                }
            });
        }
    });
}); //-------------------------------------------------------------------------

// EDIT comment route               MIDDLEWARE
router.get('/:comment_id/edit', checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
}); //-------------------------------------------------------------------------

// UPDATE comment route:         MIDDLEWARE
router.put('/:comment_id', checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
}); //-------------------------------------------------------------------------

// DESTROY comment route:        MIDDLEWARE
router.delete('/:comment_id', checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});



// our MIDDLEWARE function for isAuthenticated --------------------------------
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}; //--------------------------------------------------------------------------

//
function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect('back');
            } else {
                // equals = mongoose mathod to compare
                if (foundComment.author.id.equals(req.user._id)) {
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

















// export ROUTES:
module.exports = router; // "returning"/exporting our routes for use elsewhere

//=============================================================================
