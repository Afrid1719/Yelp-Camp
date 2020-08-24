var express          = require('express'),
    bodyParser       = require('body-parser'),
    mongoose         = require('mongoose'),
    sanitizer        = require('express-sanitizer'),
    methodOverride   = require('method-override'),
    passport         = require('passport'),
    LocalStrategy    = require('passport-local'),
    Campground       = require('./models/Campground'),
    User             = require('./models/User'),
    Campground       = require('./models/Campground'),
    Comment          = require('./models/Comment'),
    User             = require('./models/User');

var app = express();

// Database Config
mongoose.connect('mongodb://localhost:27017/yelpcamp',{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/necessities'));
app.use(express.static(__dirname + '/public'));
app.use(require('express-session')({
    secret: "The Dark Lord must return",
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
app.use(require('./routes/index'));
app.use('/campgrounds', require('./routes/campgrounds'));
app.use('/campgrounds/:id/comments', require('./routes/comments'));

// Server Config
app.listen(3000, () => {
    console.log('App Server started...');
});