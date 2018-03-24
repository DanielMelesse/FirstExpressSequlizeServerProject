// requiring our models and passport as we've configured it 
const db = require('../models');
const passport = require("../config/passport");

module.exports = function(app){

    /**
     * Using the passport.authenticate middlerware with our local strategy 
     * if the user has valid login credentials, send them to the meember page
     * Otherwise the user will be sent an error 
     * 
     */
    app.post("/api/login",
     passport.authenticate("local")
     ,function(req, res){
         /**
          * Since we are doing a POST method with javascript, we can not actally redirect that post into a GET Request
          * So we are Sending the user back the route to the memebers page because, the redirect will happen on the front end
          * They won't get this or even be able to access this page if they aren't authenticated
          * 
          * add handlebars here to redirect the the right page.. aka layouts/memebers
          */
         res.json("/members");

});

/**
 * Route for Signing up a user. The user's password is automatically hashed and stored securely thanks to 
 * how we configured our Sequelize User Model. If the user is created Successfully, proceed to log the user in,
 * otherwis send back an error 
 * 
 */
app.post("/api/signup", function(req, res){
    // out puting the req body to console 
    console.log(req.body)
    db.User.create({
        email: req.body.email,
        password: req.body.password
    }).then(function(){
        res.redirect(307, "/api/login");
    }).catch(function(err){
        // out put error 
        res.json(err);
        //res.status(422).json(err.errors.[0].message);
    });
});

// Route for login user out 
app.get("/logout", function(req, res){
    req.logout(); // express built in funcaiton 
    res.redirect("/");
})

// Route for getting some date about our user to be used client side 
app.get("/app/user_data", function(req, res){
    if(!req.user){
        // the user is not logged in, send back an empty object
        res.json({message: "you just sign in for this"});
    } else {
        // Otherwise send back the user's email and id 
        // Send back a password, even a hashed password, isn't a good idea lol 
        // you can  send  some kinda data eg if you have product u wanna dispayed
        res.json({
            email: req.user.email,
            id: req.user.id
        });
    }
});
}
