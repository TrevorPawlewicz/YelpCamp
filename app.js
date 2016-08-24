var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true})); // parse data into JS
app.set('view engine', 'ejs'); // for views folder. no .ejs needed for file ext
//-----------------------------------------------------------------------------

var myCamps = [
    {name: "camp01", image: "http://img.groundspeak.com/waymarking/a35fe824-9627-46fa-b240-f38a9c20d817.jpg"},
    {name: "camp02", image: "http://esq.h-cdn.co/assets/15/28/980x653/gallery-1436200680-10-jumbo-rocks.jpg"},
    {name: "camp03", image: "http://www.whitewatercampsites.com/_images/LedgesFire_730x480.JPG"}
];

app.get('/', function(req, res){
    res.render('landing.ejs');
}); //-------------------------------------------------------------------------

app.get('/campgrounds', function(req, res){
    //                            {name we give our data being passed in: our actual data}
    res.render('campgrounds.ejs', {campData: myCamps});
}); //-------------------------------------------------------------------------

app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs');
});


app.post('/campgrounds', function(req, res){
    // get data from form and add to myCamps array
    var name = req.body.name;
    var image = req.body.image;
    var newCamp = {name: name, image: image};
    myCamps.push(newCamp);
    // redirect back to the campgrounds page
    res.redirect('/campgrounds');
}); //-------------------------------------------------------------------------











//-----------------------------------------------------------------------------
app.listen(3000, function(req, res){
    console.log('...the YelpCamp sever has started...');
});
