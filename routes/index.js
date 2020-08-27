var router    = require('express').Router(),
    passport  = require('passport'),
    User      = require('../models/User');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('registration');
});

router.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err.message);
            req.flash('error', err.message);
            return res.redirect('/register');
        } 
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), (req, res) => {
    req.flash('success', 'You are logged in');
    return res.redirect('/campgrounds');
});

router.post('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You logged out successfully!! See you soon');
    return res.redirect('/campgrounds');
});

module.exports = router;