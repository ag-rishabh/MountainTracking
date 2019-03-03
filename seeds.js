const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
    {
        name: 'Night',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKPkl6-QTpNwNUzYKWgb3GqYUeQWyG8BgQPPYkGL8MFwnodqaM',
        description: 'Blah blah blah'
    },{
        name: 'Mountain',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7vyKwaNp8ow-vXQ9a4DNU9n_M9yYXeAPxxZjYDEDRDU-qqeML-A',
        description: 'Blah blah blah'
    },{
        name: 'Desert',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtGH9g99binBXQrCiuJ8lrNBHQQ-vN983xjdntDtA0WcVw2CbkQ',
        description: 'Blah blah blah'
    }
];

const seedDB = () => {
    Campground.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("removed Campgrounds!");
            data.forEach(seed => {
                Campground.create(seed, (err, campground) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Added a campground');
                        Comment.create(
                            {
                                text: 'This place is great',
                                author: 'Rishabh'
                            },(err,comment) => {
                                if(err){
                                    console.log(err);
                                }else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log('created new comment');
                                }
                            }
                        );
                    }
                });
            });
        }
    });
};

module.exports = seedDB;