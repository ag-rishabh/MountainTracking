const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect('/login');
}

const checkCampgroundOwnership = (req,res,next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error","Campground not found");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

router.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds });
        }
    })
});

router.post('/campgrounds', isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image
    const description = req.body.description
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {
        name,
        image,
        description,
        author
    };
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    })
});

router.get('/campgrounds/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/campgrounds/:id', (req, res) => {
    //console.log(req.user);
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(foundCampground);
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });

});

router.get('/campgrounds/:id/edit',checkCampgroundOwnership,(req,res) => {
    Campground.findById(req.params.id,(err,foundCampground) => {
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });
});

router.put('/campgrounds/:id',checkCampgroundOwnership,(req,res) => {
    Campground.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    },(err,updatedCampground) => {
        if(err){
            console.log(err);
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/campgrounds/:id',checkCampgroundOwnership,(req,res) => {
    Campground.findByIdAndDelete(req.params.id,(err)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect('/campgrounds');
        }
    })
});

module.exports = router;
