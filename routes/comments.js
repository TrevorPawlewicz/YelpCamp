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

// our MIDDLEWARE function for isAuthenticated
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}; //--------------------------------------------------------------------------

// export ROUTES:
module.exports = router; // "returning"/exporting our routes for use elsewhere

//=============================================================================