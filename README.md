# Authentication-Using-MERN-stack-passportOath-JWT 

Simple and thorough explanation of how auth flow using _**PASSPORT**_ and _**JWT**_!

Backend: [`Express.js`](https://www.npmjs.com/package/express)

`Express` is served as a server for this simple authentication app.

Database: [`Mongodb`](https://www.npmjs.com/package/mongodb) & [`Mongoose`](https://www.npmjs.com/package/mongoose)

`Mongodb Atlas` is used as the database for the simplicity of setting up a database.
`Mongoose` ease the model creation of user.

Frontend: [`React`](https://www.npmjs.com/package/react)

To be constructed

Tech Involved: [`passportjs`](https://www.npmjs.com/package/passport), [`JWT`](https://www.npmjs.com/package/jsonwebtoken), [`bcrypt`](https://www.npmjs.com/package/bcryptjs), [`validator`](https://www.npmjs.com/package/validator), [`cookie-parser`](https://www.npmjs.com/package/cookie-parser)

`passportjs` is the main tech used in this app
- [`passport-google-oauth20`](https://www.npmjs.com/package/passport-google-oauth20) is used for authentication through google
- [`passport-facebook`](https://www.npmjs.com/package/passport-facebook) is used for authentication thru facebook
- [`passport-local`](https://www.npmjs.com/package/passport-local) is used for authentication thru normal login flow
- [`passport-jwt`](https://www.npmjs.com/package/passport-jwt) is used for authentication for subsequent login (auto-login)

`JWT` is used for signing a token

`bcrypt` and `validatior` is used for password hashing and model validation respectively

`cookie-parser` is used to enable cookie setting on the client (browser)

## First Step(Preparing database and model)
- Install all the npm module. 
```
npm install
```
- create a `keys` folder and in the folder add `keys.js`. This file is to store all the secret key.
```
mkdir keys
cd keys
touch keys.js
```
```
//keys.js

module.exports = {
    PORT: xxxx,
    MONGO_URI: "ur mongoURL",
    GOOGLEID: "ur google id",
    GOOGLESECRET: "ur google secret",
    GOOGLECB: "/auth/google/callback",
    FBAPPID: "ur fb app id",
    FBAPPSECRET: "ur fb app secret",
    FBCB: "/auth/facebook/callback",
    cookieKey: "gerribish",
    jwtKey: "gerribish"
}
```
- create a database in `mongo Atlas`. 
- add the `mongodbURI` into `keys.js` and connect it with mongoose as shown in `mongoose.js`
```
mongoose.connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
},
    (err) => {
        if (err) throw new Error(err);
        console.log("database is connected");
    }
);
```
- create a `models` folder and in the folder create a `users.js` file. This file is to model our user.
```
mkdir models
cd models
touch users.js
```

## Second Step(Express!!)
- set up the backend server with express using the convention way.
- import `cookie-parser` package and use it to enable cookies 
- import `passport` package and initialize it
```
const cookie-parser = require('cookie-parser');
const passport = require('passport');
//your other package~~~~
app.use(cookie-parser());
app.use(passport.initialize());
```
- set up router in another folder
- in the router folder, here is where all the browser routes are defined
```
mkdir router
cd router
touch index.js
```

## Third Step(Setting up passport)<img src="https://ucarecdn.com/8f3cac0e-b146-4f0f-878c-680a6671d804/" width="30">
### GoogleOauth2.0 flow <img src="https://kgo.googleusercontent.com/profile_vrt_raw_bytes_1587515358_10512.png" width="30"> 
- Create a project in [`Google Console`](https://console.cloud.google.com/)
- Enable oauth2.0 and make sure to define a callback url in `credentials`
- after credential is created, you will receive googleId and googleSecret. Store them as they will be used for `GoogleStrategy`
- this callback url is the same as what is defined in the `GoogleStrategy`
- Example of google strategy can refer to the [`official docs`](http://www.passportjs.org/packages/passport-google-oauth2/)
- After defining the strategy, create a route for google auth and another for google auth callback
- be sure to enable session for `passport.authenticate` options in order to have variable of `req.user`.
```
//googleOAuth.js

passport.use(new GoogleStrategy({
    clientID: keys.GOOGLEID,
    clientSecret: keys.GOOGLESECRET,
    callbackURL: keys.GOOGLECB
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
```
```
//Router/index.js

Router.get('/auth/google',
    passport.authenticate("google", { scope: ['profile', 'email'],/* session: false*/ })
);

Router.get('/auth/google/callback',
    passport.authenticate("google", { scope: ['profile', 'email'], /* session: false*/ }),
    (req, res) => {
        console.log(req.user)
        res.redirect('/')
    }
);
```
- `passport.serializeUser()` will not be called if `session` is disable and `req.user` is not available
- `req.user` is required for creating JWT Token
- Also when defining the options, `scope` is needed by google. List of scopes can be found [`here`](https://developers.google.com/identity/protocols/oauth2/scopes)
- In the google callback route after authentication, here is where the token is created and send to the cookie.
- This will be discuss in next session

### Facebook flow <img src="https://www.facebook.com/images/fb_icon_325x325.png" width="30"> 
- Create an app in [`Facebook Developer`](https://developers.facebook.com/)
- Enable facebook signin and copy the appid and appsecret Store them as they will be used for `FacebookStrategy`
- For localhost development, redirected url is not needed to fill into the app detail
- Example of facebook strategy can refer to the [`official docs`](http://www.passportjs.org/docs/facebook/) or its [`repo`](https://github.com/jaredhanson/passport-facebook)
- the rest is just following googleoauth flow
```
Router.get('/auth/facebook',
    passport.authenticate('facebook', {/* session: false*/ })
)

Router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {/* session: false*/ }),
    (req, res) => {
        console.log(req.user)
        res.redirect('/')
    }
)
```
### Local flow <img src="https://i.pinimg.com/originals/af/a7/f2/afa7f20b64c59e9588b5b7b035234eae.jpg" width="30">
- For testing purpose, create a user
- create a route for local login using username and password
- Example of local strategy can refer to the [`official docs`](http://www.passportjs.org/packages/passport-local/)

## Forth Step and Final(Creating and decoding JWT)<img src="https://blog.logrocket.com/wp-content/uploads/2019/07/Screen-Shot-2018-10-11-at-1.40.06-PM.png" width="30">🐱‍🏍🐱‍🏍🚀
- `req.user` is now being use in this step.
- sign `req.user` with jwt and set the token to browser cookies
- the jwt is now available in the browser and we need a function to retrieve it
- we will now use the final package which is `passport-jwt` to decode the jwt and ensure we are authenticate in the website
- `passport-jwt` is a bit different from the previous 3 stategy.
- Example of jwt strategy can refer to the [`official docs`](http://www.passportjs.org/packages/passport-jwt/)
- define the option, `jwtFromRequest` and `secretOrKey` are required. Note that `secretOrKey` is the key we defined for JWT
- Our `jwtFromRequest` extracts the jwt token from the cookies.
```
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
opts.secretOrKey = keys.jwtKey;

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    //console.log(jwt_payload);
    done(null, jwt_payload);
}))
```
```
//Add signing of jwt token into previous callback

Router.get('/auth/google/callback',
    passport.authenticate("google", { scope: ['profile', 'email'], /* session: false*/ }),
    (req, res) => {
        let token = jwt.sign({ data: req.user }, keys.jwtKey, { expiresIn: MONTHINSEC });
        res.cookie('jwt', token);
        res.redirect('/')
    }
);
```
- Finally, create a route with authentication thru jwt and test out!
```
Router.get('/success', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('testing')
})
```

## MEANWHILE
### IF you prefer to use session instead, continue reading...
- To enable session, in `index.js`, use `passport.session()`.
- Unfortunately, Express has removed cookie session. Install [`cookie-session`](https://www.npmjs.com/package/cookie-session) package to enable it.
- `passport.deserializeUser()` is called when Express use `passport.session()`.
- In the function, find the user from the database using the user's id and return the user.
- `req.user` is now available in every route.

# That's IT!!!! Cheers! 🎉🙌🎉🙌
