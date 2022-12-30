const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('passport');
const app = express()

// Passport config
require("./config/passport")(passport);
// DB Config
const db = require("./config/keys").MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to database successfully"))
    .catch((err) => console.log(err))

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs")

// Bodyparser
app.use(express.urlencoded({ extended: false }))

// Express session
app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false

}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// Fash
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
})

// PORT
port = process.env.PORT || 5000

// Home page route
app.use("/", require("./route/index"))
app.use("/users", require("./route/users"))


app.listen(port, () => {
    console.log(`Listening from the port ${port}`);
})