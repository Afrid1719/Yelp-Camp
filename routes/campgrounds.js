var router      = require('express').Router(),
    Campground  = require('../models/Campground'),
    User        = require('../models/User');

var { isLoggedIn, isAuthorized } = require('../middleware/auth');

// Index
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {data : campgrounds});
        }
    });
});

//New
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// Create
router.post('/', isLoggedIn, (req, res) => {
    req.body.camp.description = req.sanitize(req.body.camp.description);
    Campground.create(req.body.camp)
        .then(campground => {
            console.log(campground.name + ' added');
            campground.author.id = req.user._id;
            campground.author.name = req.user.username;
            campground.save().then(campground => res.redirect('/')).catch(console.log);
        })
        .catch(console.log);
});

// Gallery
router.get('/gallery', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/gallery', {images : campgrounds});
        }
    });
});

// Show
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: campground, currentUser: req.user});
        }
    });
});
    

// Edit
router.get('/:id/edit', isLoggedIn, isAuthorized('Campground'), (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err.message);
        } else {
            res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

// Update
router.put('/:id', isLoggedIn, isAuthorized('Campground'), (req, res) => {
    req.body.camp.description = req.sanitize(req.body.camp.description);
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, {new: true}, function(err, updatedCampground){
        if(err){
            console.log(err.message);
        } else {
            console.log(req.body.camp.name + ' updated');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// Delete
router.delete('/:id', isLoggedIn, isAuthorized('Campground'), (req, res) => {
    Campground.findByIdAndDelete(req.params.id, function(err, deletedCamp){
        if(err){
            console.log(err.message);
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            console.log(deletedCamp.name + ' deleted');
            res.redirect('/');
        }
    });
});

module.exports = router;