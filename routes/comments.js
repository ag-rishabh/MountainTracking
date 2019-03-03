const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');


const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect('/login');
}

const checkCommentOwnership = (req,res,next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground });
        }
    });
});

router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

router.get('/campgrounds/:id/comments/:comment_id/edit',checkCommentOwnership,(req,res) => {
    Comment.findById(req.params.comment_id,(err,foundComment) => {
        if(err){
            console.log("back");
        }else{
            res.render('comments/edit',{
                campground: req.params.id,
                comment: foundComment
            });
        }
    });
});

router.put('/campgrounds/:id/comments/:comment_id',checkCommentOwnership,(req,res) => {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment) =>{
        if(err){
            console.log('back');
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/campgrounds/:id/comments/:comment_id',checkCommentOwnership,(req,res) =>{
    Comment.findByIdAndDelete(req.params.comment_id,(err) => {
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted");
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

module.exports = router;