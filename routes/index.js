// ===================== Index AUTH ROUTES ====================================

var express    = require('express');
var router     = express.Router(); // to export our routes to app.js
var passport   = require('passport');
var User       = require('../models/user.js'); // import model


// ROOT Route:
router.get('/', function(req, res){
    res.render('landing.ejs');
}); //-------------------------------------------------------------------------

// SHOW regiester form
router.get('/register', function(req, res){
    res.render('register');
}); //-------------------------------------------------------------------------

// handle sign up logic:
router.post('/register', function(req, res){
    // getting username from the form assign it to username here:
    var newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, function(err, user){

        if (err) {
            console.log(err.message);
            req.flash('error', err.message);
            return res.render('register.ejs');
        }

        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome to YelpCamp ' + user.username + '!');
            res.redirect('/campgrounds');
        });
    });
}); //-------------------------------------------------------------------------

// SHOW login form
router.get('/login', function(req, res){
    res.render('login');
}); //-------------------------------------------------------------------------

// handle login logic with passport MIDDLEWARE:
router.post('/login', passport.authenticate('local',
    {   // user is assumed to be registered here
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res) {

    }
); //-------------------------------------------------------------------------

// logout logic:
router.get('/logout', function(req, res){
    req.logout(); // passport method
    //  flash    key,     value
    req.flash('success', 'You Have Been Logged Out!');
    res.redirect('/campgrounds');
}); //------------------------------------------------------------------------




// export ROUTES: ------------------------------------------------------------
module.exports = router; // "return"/exporting our routes for use elsewhere

//=============================================================================
