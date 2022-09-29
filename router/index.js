const passport = require('passport');
const Router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require('../models/users');
const keys = require('../keys');

const MONTHINSEC = 30 * 24 * 60 * 60;

Router.get('/', (req, res) => {
    //req.user will not pass to here as passport.session is disable. we will use jwt instead
    // console.log('Cookies: ', req.cookies)
    res.send('hello world')
})

Router.get('/success', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('Successfully authenticated');
})

Router.get('/auth/google',
    passport.authenticate("google", { scope: ['profile', 'email'],/* session: false*/ })
);

Router.get('/auth/google/callback',
    passport.authenticate("google", { scope: ['profile', 'email'], /* session: false*/ }),
    (req, res) => {
        let token = jwt.sign({ data: req.user }, process.env.jwtKey, { expiresIn: MONTHINSEC });
        res.cookie('jwt', token);
        res.redirect('/success')
    }
);

Router.get('/auth/facebook',
    passport.authenticate('facebook', {/* session: false*/ })
)

Router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {/* session: false*/ }),
    (req, res) => {
        let token = jwt.sign({ data: req.user }, process.env.jwtKey, { expiresIn: MONTHINSEC });
        res.cookie('jwt', token);
        res.redirect('/success')
    }
)

Router.get('/login', (req, res) => {
    res.send(`<p>Testing</p>
    <form action="/login" method="post" >
    <div>
        <label>Username:</label>
        <input type="text" name="username"/>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Log In"/>
    </div>
</form>`)
})

Router.post('/login',
    passport.authenticate('local', { failureRedirect: "/login" }),
    (req, res) => {
        let token = jwt.sign({ data: req.user }, process.env.jwtKey, { expiresIn: MONTHINSEC });
        res.cookie('jwt', token);
        res.redirect('/success')
    }
)

/**Add in a route for testing local registeration 
 * Example
 * Router.get('/register', async (req, res) => {
    const password = await bcrpyt.hash("password", 10);
    const newUser = await User.create({
        name: "name",
        username: "username",
        inAppId: "jdnwfownrw",
        password: password,
        email: "username@gmail.com"
    })
})
*/


Router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/')
})



module.exports = Router;