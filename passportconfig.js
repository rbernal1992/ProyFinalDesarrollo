const LocalStrategy = require('passport-local').Strategy;
let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('./UserModel');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ username: 'username', password: 'password' }, (username, password, done) => {
        // Match user    
        User.findOne({
            username: username
        //    password: hashpass
        }).then(user => {
            if (!user) {
                return done(null, false, { message: 'That username is not registered' });
            }
        
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }


            });

        });
        //------------------------------------------------------

    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

