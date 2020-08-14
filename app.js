var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();

// Middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('necessities'));
app.use(express.static('public'));

// Server Config
app.listen(3000, () => {
    console.log('App Server started...');
});

// Database Config
mongoose.connect('mongodb://localhost:27017/yelpcamp',{useNewUrlParser: true, useUnifiedTopology: true});

// Schema build
// const Schema = mongoose.Schema();
const campSchema = mongoose.Schema({
    name: String,
    image: String
});

// Model build
var Campground = mongoose.model('Campground', campSchema);

// Adding Sample Models
// for (let camp in data){
//     Campground.create({name: camp.name, image: camp.image})
//             .then(response => {
//                 console.log(`${camp.name} added`)
//             })
//             .catch(console.log);
// }

// Routes
app.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render('index', {data : campgrounds});
        }
    });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('newCampForm');
});

app.post('/campgrounds', (req, res) => {
    Campground.create({name: req.body.name, image: req.body.image})
        .then(response => {
            console.log(response.name + ' added')
        })
        .catch(console.log);
    res.redirect('/');
});

app.get('/campgrounds/gallery', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render('gallery', {images : campgrounds});
        }
    });
});

app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
            res.render('campground', {campground : campground});
        }
    });
});