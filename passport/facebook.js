const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');

const keys = require('../keys');
const User = require('../models/users');

passport.use(new FacebookStrategy({
    clientID: process.env.FBAPPID,
    clientSecret: process.env.FBAPPSECRET,
    callbackURL: process.env.FBCB,
    profileFields: ['email', 'id', 'displayName', 'name', 'birthday']
},
    async (accessToken, refreshToken, profile, done) => {
        const fetchedUser = formatFBProfile(profile);
        let existingUser = await User.findOne({ inAppId: fetchedUser.inAppId });

        if (existingUser) {
            existingUser = existingUser.toJSON();
            return done(null, existingUser);
        }
        fetchedUser.password = await bcrypt.hash(fetchedUser.password, 10);
        let user = await User.create({ ...fetchedUser });
        user = user.toJSON();
        done(null, user);
    })
)

const formatFBProfile = (profile) => {console.log(profile);
    const user = {
        inAppId: profile._json.id,
        name: profile._json.name,
        username: profile._json.id,
        password: profile._json.id,
        provider: profile.provider,
        email: profile._json.email,
        DOB: profile._json.birthday
    }
    return user;
}
