var express = require('express');
var path = require('path');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('necessities'));
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('App Server started...');
});

app.get('/', (req, res) => {
    res.render('index');
});