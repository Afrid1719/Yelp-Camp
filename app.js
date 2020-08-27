var express          = require('express'),
    bodyParser       = require('body-parser'),
    mongoose         = require('mongoose'),
    session          = require('express-session'),
    MongoStore       = require('connect-mongo')(session),
    sanitizer        = require('express-sanitizer'),
    methodOverride   = require('method-override'),
    passport         = require('passport'),
    LocalStrategy    = require('passport-local'),
    flash            = require('connect-flash'),
    Campground       = require('./models/Campground'),
    User             = require('./models/User'),
    Campground       = require('./models/Campground'),
    Comment          = require('./models/Comment'),
    User             = require('./models/User');

var app = express();

// Database Config
mongoose.connect('mongodb+srv://afrid1719:helloafrid17@cluster0.zkxaq.mongodb.net/yelpcamp?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/necessities'));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: "The Dark Lord must return",
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: true,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.user     = req.user;
    res.locals.success  = req.flash('success');
    res.locals.error    = req.flash('error');
    res.locals.info     = req.flash('info');
    res.locals.warning  = req.flash('warning');
    next();
});

//Routes 
app.use(require('./routes/index'));
app.use('/campgrounds', require('./routes/campgrounds'));
app.use('/campgrounds/:id/comments', require('./routes/comments'));

// Server Config
app.listen(process.env.PORT || 3000, () => {
    console.log('App Server started...');
});