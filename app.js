// require package dependencies:
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var passport       = require('passport');
var LocalStrategy  = require('passport-local');
var methodOverride = require('method-override');
var Camp           = require('./models/campground.js'); // import model
var User           = require('./models/user.js');       // import model
var Comment        = require('./models/comment.js');    // import model
var seedDB         = require('./seeds.js');

// require all route dependencies:
var indexRoutes      = require('./routes/index'),
    campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes    = require('./routes/comments');

//                                    yelp_camp is our dadtabase name
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true})); // parse data into JS
app.set('view engine', 'ejs'); // for views folder. no .ejs needed for file ext
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method')); //

//seedDB(); // seed the database evrytime we run app.
//-----------------------------------------------------------------------------

// PASSPORT Configuration: ----------------------------------------------------
app.use(require('express-session')({
    secret: 'Buy the ticket Take the ride.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // passport-local-mongoose
passport.serializeUser(User.serializeUser()); // passport-local-mongoose
passport.deserializeUser(User.deserializeUser()); // passport-local-mongoose
//-----------------------------------------------------------------------------

// our MIDDLEWARE for currentUser
// *** whatever we put into res.locals we can use in our template
app.use(function(req, res, next){
    // req.user will be empty if no one is signed in
    res.locals.currentUser = req.user;
    next(); // move forward
});

// tell app.js to use the Routes we have required above in routes:
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes); // include route path in our app.use
app.use('/campgrounds/:id/comments', commentRoutes);


//-----------------------------------------------------------------------------
app.listen(3000, function(req, res){
    console.log('...the YelpCamp sever has started...');
});
//-----------------------------------------------------------------------------
