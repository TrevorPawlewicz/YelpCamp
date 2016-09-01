var express  = require('express');
var router   = express.Router(); // to export our routes to app.js
var passport = require('passport');
var User     = require('../models/user.js'); // import model

// ========================= AUTH ROUTES ======================================
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
    //                     getting username from the form
    var newUser = new User({username: req.body.username});
    //
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render('register.ejs');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        })
    });
}); //-------------------------------------------------------------------------

// SHOW login form
router.get('/login', function(req, res){
    res.render('login');
}); //-------------------------------------------------------------------------

// handle login logic with MIDDLEWARE:
router.post('/login', passport.authenticate('local',
    {   // user is assumed to be registered here
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res) {

    }
); //-------------------------------------------------------------------------

// logout logic:
router.get('/logout', function(req, res){
    req.logout(); // method passport
    res.redirect('/campgrounds');
});
//=============================================================================
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
