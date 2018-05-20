module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/users/login');
    },
    ensureAdmin: function(req, res, next){
        if(req.isAuthenticated()){
            if(req.user.role == 'admin'){
                return next();
            }
        }
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/');
    }
}