// require package dependencies:
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var flash          = require('connect-flash'); // messages
var passport       = require('passport'); // authentication
var LocalStrategy  = require('passport-local'); // authentication
var methodOverride = require('method-override'); // for routes
var Camp           = require('./models/campground.js'); // import model
var User           = require('./models/user.js');       // import model
var Comment        = require('./models/comment.js');    // import model
var seedDB         = require('./seeds.js'); // our seed data file

// require all route dependencies:
var indexRoutes      = require('./routes/index'),
    campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes    = require('./routes/comments');

var PORT = process.env.PORT || 3000;


//mongoose.connect('mongodb://localhost/yelp_camp'); //localhost:3000 database
mongoose.connect("mongodb://trevs_data:wordUp@ds019766.mlab.com:19766/trevs_yelp_camp");

app.use(bodyParser.urlencoded({extended: true})); // parse data into JS
app.set('view engine', 'ejs'); // for views folder. no .ejs needed for file ext
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method')); //
app.use(flash());

//seedDB(); // seed the database everytime we run app with its data.
//-----------------------------------------------------------------------------

// PASSPORT Configuration: ----------------------------------------------------
app.use(require('express-session')({
    secret: 'Buy the ticket Take the ride.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //passport-local-mongoose
passport.serializeUser(User.serializeUser()); // passport-local-mongoose
passport.deserializeUser(User.deserializeUser()); // passport-local-mongoose
//-----------------------------------------------------------------------------

// our MIDDLEWARE for currentUser
// *** whatever we put into res.locals we can use in our ejs template
app.use(function(req, res, next){
    // req.user will be empty if no one is signed in
    res.locals.currentUser = req.user;
    res.locals.errorMessage = req.flash('error'); // pass in flash error message
    res.locals.successMessage = req.flash('success'); //pass in flash success
    next(); // move forward
});

// tell app.js to use the Routes we have required above in routes:
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes); // include route path in our app.use
app.use('/campgrounds/:id/comments', commentRoutes);


//-----------------------------------------------------------------------------
app.listen(PORT, function(req, res){
    console.log('...the YelpCamp sever has started on: ' + PORT);
});
//-----------------------------------------------------------------------------
