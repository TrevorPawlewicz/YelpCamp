// seeds.js--------------------------------------------------------------------
var mongoose = require('mongoose');
var Camp     = require('./models/campground.js');
var Comment  = require('./models/comment.js');

// starting seed data:
var data = [
    {
        name: 'The Desert',
        image: 'http://www.lamag.com/wp-content/uploads/sites/9/2015/05/thedesert-1.jpg',
        description: "Lebowski ipsum walter, come off it. You're not even fucking Jewish. You're fucking Polish Catholic. Dolor sit amet, consectetur adipiscing elit praesent ac magna justo pellentesque ac. Every time a rug is micturated upon in this fair city, I have to compensate. Lectus quis elit blandit fringilla a ut turpis praesent felis ligula, malesuada. You know, the usual. Bowl. Drive around."
    },
    {
        name: 'Whiskey Town',
        image: 'http://esq.h-cdn.co/assets/15/28/980x653/gallery-1436200680-10-jumbo-rocks.jpg',
        description: "Lebowski ipsum walter, come off it. You're not even fucking Jewish. You're fucking Polish Catholic. Dolor sit amet, consectetur adipiscing elit praesent ac magna justo pellentesque ac. Every time a rug is micturated upon in this fair city, I have to compensate. Lectus quis elit blandit fringilla a ut turpis praesent felis ligula, malesuada. You know, the usual. Bowl. Drive around."
    },
    {
        name: 'Midnight Delight',
        image: 'https://images.theoutbound.com/uploads/1437140402255/wumsmrfw78e/ca76c0961beec40ee34c0e8b7997e543?w=900&h=600&fit=crop',
        description: "Lebowski ipsum walter, come off it. You're not even fucking Jewish. You're fucking Polish Catholic. Dolor sit amet, consectetur adipiscing elit praesent ac magna justo pellentesque ac. Every time a rug is micturated upon in this fair city, I have to compensate. Lectus quis elit blandit fringilla a ut turpis praesent felis ligula, malesuada. You know, the usual. Bowl. Drive around."
    }
];

function seedDB(){
    //   REMOVE all camps...
    Camp.remove({}, function(err){
        if (err) {
            console.log(err);
        }
        console.log("Removed all camps!");
        /*
        // then add some camps from seed data
        data.forEach(function(seed){
            Camp.create(seed, function(err, campSchemaData){
                if (err) {
                    console.log(err);
                } else {
                    console.log('camp added!');
                    // create comments:
                    Comment.create(
                        {
                            text: 'camping here is fun!',
                            author: 'Bob'
                        }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else {
                                campSchemaData.comments.push(comment);
                                campSchemaData.save();
                                console.log('comment created!');
                            }
                        }
                    );
                }
            });
        });
        */
    });
};

// export the function
module.exports = seedDB;
