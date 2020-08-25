var router      = require('express').Router({mergeParams: true}),
    Comment     = require('../models/Comment'),
    Campground  = require('../models/Campground');

var { isLoggedIn, isAuthorized } = require('../middleware/auth');

router.post('/', isLoggedIn, (req, res) => {
    req.body.comment = req.sanitize(req.body.comment);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err.message);
            req.flash('error', err.message);
            return res.redirect('/campgrounds/' + req.params.id);
        } else {
            Comment.create({
                text: req.body.comment,
                author: {id: req.user._id, name: req.user.username}
            }, function(err, comment){
                if(err){
                    console.log(err.message);
                    req.flash('error', err.message);
                    return res.redirect('/campgrounds/' + req.params.id);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + req.params.id);        
                }
            });     
        }
    });
});

router.put('/:comment_id', isLoggedIn, isAuthorized('Comment'), (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, {text: req.body.comment_body}, {new: true}, function(err, updatedComment){
        if(err){
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('back');
        } else {
            console.log('Comment Updated');
            req.flash('info', 'Comment Updated successfully!!');
            return res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/:comment_id', isLoggedIn, isAuthorized('Comment'), (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, function(err, deletedComment){
        if(err){
            console.log(err.message);
            req.flash('error', err.message);
            return res.redirect('/campgrounds/' + req.params.id);
        } else {
            console.log('Comment deleted: ' + deletedComment.text);
            req.flash('info', 'Comment deleted successfully!!');
            return res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;