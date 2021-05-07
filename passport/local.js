const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/users');

passport.use(new LocalStrategy({ session: false, },
    async (username, password, done) => {
        let existingUser;
        try {
            existingUser = await User.findOne({ username: username });
            if (!existingUser) {
                throw new Error("no user found");
            }
        } catch (err) {
            return done(err);
        }
        try {
            const isMatch = await
                bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                throw new Error("invalid password");
            }
        } catch (err) {
            return done(err, false);
        }
        existingUser = existingUser.toJSON();
        done(null, existingUser);

    }
))