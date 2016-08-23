var express = require('express');
var app     = express();

app.set('view engine', 'ejs'); // for views folder. no .ejs needed for file ext



app.get('/', function(req, res){
    res.render('landing.ejs');
});

app.get('/campgrounds', function(req, res){

    var myCamps = [
        {name: "camp01", image: "http://img.groundspeak.com/waymarking/a35fe824-9627-46fa-b240-f38a9c20d817.jpg"},
        {name: "camp02", image: "http://esq.h-cdn.co/assets/15/28/980x653/gallery-1436200680-10-jumbo-rocks.jpg"},
        {name: "camp03", image: "http://www.whitewatercampsites.com/_images/LedgesFire_730x480.JPG"}
    ];
    //                            {name we give our data being passed in: our actual data}
    res.render('campgrounds.ejs', {campData: myCamps});
});





























//-----------------------------------------------------------------------------
app.listen(3000, function(req, res){
    console.log('Sever has started on PORT 3000');
});
