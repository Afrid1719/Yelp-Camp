var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    sanitizer = require('express-sanitizer'),
    methodOverride = require('method-override'),
    Campground = require('./models/Campground'),
    app = express();

// Database Config
mongoose.connect('mongodb://localhost:27017/yelpcamp',{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(methodOverride('_method'));
app.use(express.static('necessities'));
app.use(express.static('public'));

// Server Config
app.listen(3000, () => {
    console.log('App Server started...');
    // console.log(process.env);
});

// Routes
// Index
app.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render('index', {data : campgrounds});
        }
    });
});

//New
app.get('/campgrounds/new', (req, res) => {
    res.render('newCampForm');
});

// Create
app.post('/campgrounds', (req, res) => {
    req.body.camp.description = req.sanitize(req.body.camp.description);
    Campground.create(req.body.camp)
        .then(response => {
            console.log(response.name + ' added');
            res.redirect('/');
        })
        .catch(console.log);
});

// Gallery
app.get('/campgrounds/gallery', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render('gallery', {images : campgrounds});
        }
    });
});

// Show
app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
            res.render('campground', {campground : campground});
        }
    });
});

// Edit
app.get('/campgrounds/:id/edit', (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err.message);
        } else {
            res.render('editCampgroundForm', {campground: foundCampground});
        }
    });
});

// Update
app.put('/campgrounds/:id', (req, res) => {
    req.body.camp.description = req.sanitize(req.body.camp.description);
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, oldCampground){
        if(err){
            console.log(err.message);
        } else {
            console.log(req.body.camp.name + ' updated');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// Delete
app.delete('/campgrounds/:id', (req, res) => {
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