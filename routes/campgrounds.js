// ======================== Campgrounds ROUTES ===============================

var express    = require('express');
var router     = express.Router(); // to export our routes to app.js
var Camp       = require('../models/campground.js'); // import model
var Comment    = require('../models/comment.js');    // import model
var middleware = require('../middleware/middleware.js'); // index.js is default by express

// INDEX - show all campgrounds
// router.get('/campgrounds', function(req, res){
router.get('/', function(req, res){
    //   find all camps form the DB
    Camp.find({}, function(err, allCamps){
        if (err){
            console.log(err)
        } else {
            // {name we give our data being passed in: our actual data}
            res.render('campgrounds/index.ejs', {campData: allCamps, currentUser: req.user});
        }
    });
}); //-------------------------------------------------------------------------

// router.get('/campgrounds/new', isLoggedIn, function(req, res){
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new.ejs');
}); //-------------------------------------------------------------------------

// SHOW - show more info about one campground
// router.get('/campgrounds/:id', function(req, res){
router.get('/:id', function(req, res){
    //   findById is a mongoose method
    Camp.findById(req.params.id).populate('comments').exec(function(err, foundCamp){
        if (err) {
            console.log(err);
        } else {
            // render show template with that camp
            res.render('campgrounds/show.ejs', {campData: foundCamp});
        }
    });
}); //-------------------------------------------------------------------------

// CREATE - add new camp to DB
// router.post('/campgrounds', isLoggedIn, function(req, res){
router.post('/', middleware.isLoggedIn, function(req, res){
    // get data from form:
    var name = req.body.name;
    var image = req.body.image;
    var descript = req.body.description;
    var thisAuthor = {
        id: req.user._id,
        username: req.user.username
    }
    // add info to new object {key is accessed in ejs: value is passed into key}
    var newCamp = {
        name: name,
        image: image,
        description: descript,
        author: thisAuthor
    };

    // create a new camp and save it to our DB:
    Camp.create(newCamp, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            console.log(newCamp);
            // redirect back to the campgrounds page
            res.redirect('/campgrounds');
        }
    });
}); //-------------------------------------------------------------------------

// EDIT camp route:
router.get('/:id/edit', middleware.checkCampOwnership, function(req, res){
    Camp.findById(req.params.id, function(err, foundCamp){
        if (err) {
            req.flash('error', 'Cannot Find Specified Item!');
        } else {
            res.render('campgrounds/edit.ejs', {campData: foundCamp});
        }
    });
}); //-------------------------------------------------------------------------

// UPDATE camp route
router.put('/:id', middleware.checkCampOwnership, function(req, res){
    //                                    editCamp from form edit.ejs
    Camp.findByIdAndUpdate(req.params.id, req.body.editCamp, function(err, updatedCamp){
        if (err) {
            req.flash('error', 'Cannot Find Specified Item!');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
}); //-------------------------------------------------------------------------

// DESTROY camp
router.delete('/:id', middleware.checkCampOwnership, function(req, res){
    Camp.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect('/campgrounds'); // views directory
        } else {
            res.redirect('/campgrounds'); // views directory
        }
    });
}); //-------------------------------------------------------------------------



// export ROUTES: ------------------------------------------------------------
module.exports = router; // "return"/exporting our routes for use elsewhere

//=============================================================================
