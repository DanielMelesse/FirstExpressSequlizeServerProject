// this is middleware for restrictin routes a user is not allowed to visit if not logged in
module.exports = function(req, res, next){
    // if the user is not logged in, continue with the request to restricted route
    if(req.user){
        return next();
    }
    // if the user isnt logged in redirect them to login page 
    return res.redirect("/");
}