// importing passport packages required for authentication

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// import local models folder to check passowrd again
const db = require('../models');

/**
 * Telling passport we want to user a Local Strategy
 * In the Other Word we will login with a username/email and password 
 * we use local strategy to valid the user password.
 */
passport.use(new LocalStrategy(
    // our user will sign in using an email, rather then "username" 
    {
        usernameField: "email"
    },
    function(email, passowrd, done){
        // when a user tries to sing in thes code runs 
        // get user object from db using the email 
        db.User.findOne({
            where: {
                email: email
            }
        }).then(function(dbUser){
            // if there's no user with the given email 
            if(!dbUser){
                return don(null, false, {
                    message: "Incorrect eamil"
                })
            } 
            // if there is a user with the given email, but the password the user 
            // gives us is incorrect
            else if (!dbUser.validPassword(passowrd)){
                return done(nul, false, {
                    message: "Incorrect Password"
                });
            }
            // if none of the above, return the user 
            return done(null, dbUser)  
        });
    }
));

/**
 * In order to help keep Authentication state across http request
 * Sequelize needs to serialize and deserialize the user 
 * Just consider this part boilerplate needed to make if all work
 * 
 */
passport.serializeUser(function(user, callback){
    callback(null, user)
});

passport.deserializeUser(function(obj, callback){
    callback(null, obj)
})

// Exporting configured passport 
module.exports = passport;