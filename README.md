# Authentication-Using-MERN-stack-passport-JWT
Simple and thorough explanation of how auth flow using passport and jwt!

Backend: Express.js
Express is served as a server for this simple authentication app.

Database: Mongodb & Mongoose
Mongodb Atlas is used as the database for the simplicity of setting up a database.
Mongoose ease the model creation of user.

Frontend: React
To be constructed

Tech Involved: Passportjs, JWT, bcrpt, validator, cookie-parser
passportjs is the main tech used in this app
- passport-google-oauth20 is used for authentication through google
- passport-facebook is used for authentication thru facebook
- passport-local is used for authentication thru normal login flow
- passport-jwt is used for authentication for subsequent login (auto-login)

JWT is used for signing a token

bcrypt and validatior is used for password hashing and model validation respectively

cookie-parser is used to enable cookie setting on the client (browser)

## First Step(Preparing database and model)
- Install all the npm module.
- create a "keys" folder and in the folder add "keys.js". This file is to store all the secret key.
- create a database in mongo Atlas. 
- add the mongodburi into keys.js and connect it with mongoose as shown in "mongoose.js"
- create a "models" folder and in the folder create a "users.js" file. This file is to model our user.

## Second Step(Express!!)
- set up the backend server with express using the convention way.
- import "cookie-parser" package and use it to enable cookies 
- import "passport" package and initialize it
- set up router in another folder
- in the router folder, here is where all the browser routes are defined

## Third Step(Setting up passport)
### GoogleOauth2.0 flow
- Create a project in Google Console(https://console.cloud.google.com/)
- Enable oauth2.0 and make sure to define a callback url in "credentials"
- after credential is created, you will receive googleid and googlesecret. Store them as they will be used for GoogleStrategy
- this callback url is the same as what is defined in the GoogleStrategy
- Example of google strategy can refer to http://www.passportjs.org/packages/passport-google-oauth2/
- After defining the strategy, create a route for google auth and another for google auth callback
- be sure to enable session for passport.authenticate options in order to have variable of req.user.
- passport.serializeUser will not be called if session is disable and req.user is not available
- req.user is required for creating JWT Token
- Also when defining the options, scope is needed by google. List of scope can be found here: https://developers.google.com/identity/protocols/oauth2/scopes
- In the google callback route after authentication, here is where the token is created and send to cookie.
- This will be discuss in next session

### Facebook flow
- Create an app in Facebook Developer(https://developers.facebook.com/)
- Enable facebook signin and copy the appid and appsecret Store them as they will be used for FacebookStrategy
- For localhost development, redirected url is not needed to fill into the app detail
- Example of facebook strategy can refer to http://www.passportjs.org/docs/facebook/ or https://github.com/jaredhanson/passport-facebook
- the rest is just following googleoauth flow

### Local flow
- For testing purpose, create a user
- create a route for local login using username and password
- Example of local strategy can refer to http://www.passportjs.org/packages/passport-local/

## Forth Step and Final(Creating and decoding JWT)🐱‍🏍🐱‍🏍🚀
- req.user is now being use in this step.
- sign req.user with jwt and set the token to browser cookies
- the jwt is now available in the browser and we need a function to retrieve it
- we will now use the final package which is "passport-jwt" to decode the jwt and ensure we are authenticate in the website
- passport-jwt is a bit different from the previous 3 stategy.
- Example of jwt strategy can refer to http://www.passportjs.org/packages/passport-jwt/
- define the option, jwtFromRequest and secretOrKey is required. Note that secretOrKey is the key we defined for JWT
- Our jwtFromRequest extracts the jwt token from the cookies
- Finally, create a route with authentication thru jwt and test out!

## MEANWHILE
### IF you prefer to use session instead, continue reading...
- To enable session, in index.js, use passport.session().
- Unfortunately, Express has removed cookie session. Install "cookie-session" package to enable it.
- passport.deserializeUser is called when Express use passport.session().
- In the function, find the user from the database using th user's id and return the user.
- req.user is now available in every route.

# That's IT!!!! Cheers! 🎉🙌🎉🙌
