module.exports.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
};

module.exports.isAuthorized = function(resourceType){
    const Model = require('../models/' + resourceType);
    var resourceId;
    return function(req, res, next){
        if(resourceType === 'Comment')
            resourceId = req.params.comment_id;
        else
            resourceId = req.params.id;
        Model.findById(resourceId, function(err, resource){
            if(err){
                console.log(err.message);
                res.redirect('back');
            } else {
                if(resource.author.id.equals(req.user._id))
                    return next();
                // Will flash messages for not being authorized
                res.redirect('back');
            }
        });
    };    
}