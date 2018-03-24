// requiring bcrypt for password hashing, Using the bcrypt-nodejs version as 
// the regular bcrypt module sometimes cases error on windows machines
const bcrypt = require('bcrypt-nodejs');

//Creating our User Model
// Set it as export becasue we will need it required on the server
// 

module.exports = function(sequelize, DataTypes){
    var User = sequelize.define("User", {

        // the email cont be null and must be a proper email before creation
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        // the password cnnot be null, you can add requirement latter
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
       
    });

    /**
     * this is how you create custom method for any models 
     * 
     * Creating a custom method for User model. 
     * this will check if an unhashed pasword entered by the 
     * user can be compared to the hashed assword stored in database
     * 
     */
    User.prototype.validPassword = function(password){
        return bcrypt.compareSync(password, this.password);
    };

    // how to add hooks to models 
    /**
     * Hooks are automatic methods that run during  various phases of 
     * the User Modle lifeCycle. In this case, Before a User is created,
     * We will automatically hash their password using bcrypt salt
     */
    User.hook("beforeCreate", function(user){
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });
    // return the user object 
    return User;
}