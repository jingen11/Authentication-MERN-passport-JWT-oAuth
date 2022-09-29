const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');

const keys = require('../keys');
const User = require('../models/users');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLEID,
    clientSecret: process.env.GOOGLESECRET,
    callbackURL: process.env.GOOGLECB
},
    async (accessToken, refreshToken, profile, done) => {
        const fetchedUser = formatGoogleProfile(profile);
        let existingUser = await User.findOne({ inAppId: fetchedUser.inAppId });

        if (existingUser) {
            existingUser = existingUser.toJSON();
            return done(null, existingUser);
        }
        fetchedUser.password = await bcrypt.hash(fetchedUser.password, 10);
        let user = await User.create({ ...fetchedUser });
        user = user.toJSON();
        done(null, user);
    }
),
)

const formatGoogleProfile = (profile) => {
    const user = {
        inAppId: profile._json.sub,
        name: profile._json.name,
        username: profile._json.sub,
        password: profile._json.sub,
        provider: profile.provider,
        email: profile._json.email
    }
    return user;
}