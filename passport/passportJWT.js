const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;

// const keys = require('../keys');
let opts = {};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
        console.log("cookie extractor", token);
    }
    return token;
}

opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.jwtKey;


passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    //console.log(jwt_payload);
    done(null, jwt_payload);
}))