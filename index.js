require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
//const cookieSession = require('cookie-session'); **For session authentication
const passport = require("passport");

// const keys = require("./keys");
const routes = require("./router");

require("./db/mongoose");
require("./passport/passport");

const app = express();

const PORT = process.env.PORT;

app.use(cookieParser());
// app.use(
//     cookieSession({
//         maxAge: 30 * 24 * 60 * 60 * 1000,
//         keys: [keys.cookieKey]
//     })
// ); **For session authentication
/*Important for POST request */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//
app.use(passport.initialize());
//app.use(passport.session()); **For session authentication
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
