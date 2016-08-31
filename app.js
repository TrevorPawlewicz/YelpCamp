var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var passport      = require('passport');
var LocalStrategy = require('passport-local');
var Camp          = require('./models/campground.js'); // import camground.js
var User          = require('./models/user.js');
var Comment       = require('./models/comment.js');
var seedDB        = require('./seeds.js');

//                                    yelp_camp is our dadtabase name
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true})); // parse data into JS
app.set('view engine', 'ejs'); // for views folder. no .ejs needed for file ext
app.use(express.static(__dirname + '/public'));

seedDB(); // seed the database evrytime we run app.
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

// ROUTES: --------------------------------------------------------------------
app.get('/', function(req, res){
    res.render('landing.ejs');
}); //-------------------------------------------------------------------------

// INDEX - show all campgrounds
app.get('/campgrounds', function(req, res){
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

app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new.ejs');
}); //-------------------------------------------------------------------------

// SHOW - show more info about one campground
app.get('/campgrounds/:id', function(req, res){
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
app.post('/campgrounds', function(req, res){
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
//=============================================================================


// ====================== COMMENT ROUTES ======================================
//                                       MIDDLEWARE
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
    // find by ID
    Camp.findById(req.params.id, function(err, foundCamp){
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new.ejs', {campData: foundCamp});
        }
    });
});
//                                    MIDDLEWARE
app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
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
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    res.redirect('/campgrounds/' + foundCamp._id);
                }
            });
        }
    });
});
//=============================================================================

// ========================= AUTH ROUTES ======================================
// SHOW regiester form
app.get('/register', function(req, res){
    res.render('register');
});

// handle sign up logic:
app.post('/register', function(req, res){
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
});

// SHOW login form
app.get('/login', function(req, res){
    res.render('login');
});

// handle login logic with MIDDLEWARE:
app.post('/login', passport.authenticate('local',
    {   // user is assumed to be registered here
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res) {

    }
);

// logout logic:
app.get('/logout', function(req, res){
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
}; //-----------------------------------------

























//-----------------------------------------------------------------------------
app.listen(3000, function(req, res){
    console.log('...the YelpCamp sever has started...');
});
//-----------------------------------------------------------------------------
