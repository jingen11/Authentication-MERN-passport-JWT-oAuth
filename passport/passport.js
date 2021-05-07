const passport = require('passport');

passport.serializeUser((user, done) => {
    //serializeuser is call whenever passport.authenticate call with session set to true
    //will return req.user
    console.log('serializeUSer', user)
    done(null, user.username);
})

passport.deserializeUser((id, done) => {
    // deserializeuser is not called with passport.session disable
    console.log('deserializeUSer', id)
    done(null, id);
})

require('./googleOAuth');
require('./facebook');
require('./local');
require('./passportJWT')




