// ====================== CommentS ROUTES =====================================

var express    = require('express');
var router     = express.Router({mergeParams: true}); // combine Comment & Camp
var Camp       = require('../models/campground.js'); // import model
var Comment    = require('../models/comment.js');    // import model
var middleware = require('../middleware'); // index.js is default by express


// router.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
router.get('/new', middleware.isLoggedIn, function(req, res){
    // find by ID
    Camp.findById(req.params.id, function(err, foundCamp){
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new.ejs', {campData: foundCamp});
        }
    });
}); //-------------------------------------------------------------------------

// router.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
router.post('/', middleware.isLoggedIn, function(req, res){
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

// EDIT comment route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
}); //-------------------------------------------------------------------------

// UPDATE comment route:
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
}); //-------------------------------------------------------------------------

// DESTROY comment route:
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});




// export ROUTES: ------------------------------------------------------------
module.exports = router; // "return"/exporting our routes for use elsewhere

//=============================================================================
