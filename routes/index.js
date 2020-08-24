var router    = require('express').Router(),
    passport  = require('passport'),
    User      = require('../models/User');

router.get('/', (req, res) => {
    res.redirect('/campgrounds');
});

router.get('/register', (req, res) => {
    res.render('registrationForm.ejs');
});

router.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err.message);
            return res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, function(){
                res.redirect('/');
            });
        }
    });
});

router.get('/login', (req, res) => {
    res.render('loginForm');
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/');
});

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;