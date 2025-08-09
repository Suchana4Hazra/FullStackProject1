const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const expressLayouts = require('express-ejs-layouts');
const session = require("express-session")
const svgCaptcha = require('svg-captcha')
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user.js")
const flash = require('connect-flash')

if(process.env.NODE_ENV != "production") {
   require("dotenv").config();
}
console.log(process.env.SESSION_SECRET)

const ListingRouter = require('./routes/listing.js')
const ReviewRouter = require('./routes/reviews.js')
const UserRouter = require("./routes/user.js")


const PORT = 3000;

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')));
app.use(methodOverride("_method"))
app.use(expressLayouts);
app.set('layout', 'layouts/boilerplate');
app.engine('ejs',ejsMate);

const sessionOptions = {
    secret : 'mysupersecretcode',
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});


app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});

// app.get("/", (req, res) => {
//     console.log("root");
//     res.send("Welcome to StayTogether!");
// })
app.use('/listings',ListingRouter);
app.use('/listings',ReviewRouter);
app.use('/',UserRouter);

app.use((req, res) => {
    res.status(404).render("errors/404", { layout: false, title: "Page Not Found" });
});



connectToDatabase().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Connect to MongoDB
async function connectToDatabase() {
    await mongoose.connect('mongodb://localhost:27017/StayTogether');
}

