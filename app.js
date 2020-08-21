var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    sanitizer = require('express-sanitizer'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    LocalStrategy = require('passport-local');
    User = require('./models/User');
    Campground = require('./models/Campground'),
    Comment = require('./models/Comment'),
    User = require('./models/User'),
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
app.use(require('express-session')({
    secret: "The Dark Lord mut return",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    app.locals.user = req.user;
    next();
});

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
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
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
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, {new: true}, function(err, updatedCampground){
        if(err){
            console.log(err.message);
        } else {
            console.log(req.body.camp.name + ' updated');
            // Comment.create({text: 'Niceeeeeeeeeeee', author: 'Afrid'}, function(err, comment){
            //     if (err)
            //         console(err.message);
            //     else
            //         updatedCampground.comments.push(comment);
            // });
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

//=====================================//
//Auth Routes
//=====================================//

app.get('/register', (req, res) => {
    res.render('registrationForm.ejs');
});

app.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err.message);
            return res.render('/register');
        } else {
            passport.authenticate('local')(req, res, function(){
                res.redirect('/');
            });
        }
    });
});

app.get('/login', (req, res) => {
    res.render('loginForm');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/');
});

app.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});