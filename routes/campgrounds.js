// ======================== Campgrounds ROUTES ===============================

var express = require('express');
var router  = express.Router(); // to export our routes to app.js
var Camp    = require('../models/campground.js'); // import model
var Comment = require('../models/comment.js');    // import model

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
            //res.render('campgrounds/index.ejs', {campData: allCamps});
        }
    });
}); //-------------------------------------------------------------------------

// router.get('/campgrounds/new', function(req, res){
router.get('/new', function(req, res){
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
// router.post('/campgrounds', function(req, res){
router.post('/', function(req, res){
    // get data from form:
    var name = req.body.name;
    var image = req.body.image;
    var descript = req.body.description;
    // add info to new object               {key is accessed in ejs}
    var newCamp = {name: name, image: image, description: descript};

    // create a new camp and save it to our DB:
    Camp.create(newCamp, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            // redirect back to the campgrounds page
            res.redirect('/campgrounds');
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
