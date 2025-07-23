const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const expressLayouts = require('express-ejs-layouts');
const session = require("express-session")
const svgCaptcha = require('svg-captcha')
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require('./schema.js')
const ExpressError = require("./utils/ExpressError.js")
const moment = require('moment');

// require('dotenv').config();


const PORT = 3000;

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')));
app.use(methodOverride("_method"))
app.use(expressLayouts);
app.set('layout', 'layouts/boilerplate');
app.engine('ejs',ejsMate);


// Route to serve CAPTCHA
app.use(session({
    secret: '48ca4a4829287a59beca642731cd5bb8ef8112d33657df776a62548c4d66fc5a67332cc0d8954a2d8025c0848bc8d346352fd6a9c234fd73e84ee8d0f5e5b523',
    resave: false,
    saveUninitialized: true
}));

app.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});



app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});

app.get("/", (req, res) => {
    console.log("root");
    res.send("Welcome to StayTogether!");
})

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Index Route
app.get('/listings', async (req, res) => {
    console.log("list")
    const allListing = await listing.find({});
    res.render('listings/index', { allListing, title: "All Listings" });
})

//new route
app.get('/listings/new', (req, res) => {
    console.log("new listing");
    res.render('listings/new', { layout: false,title: "Add New Listing" });
})

// //Edit route
// app.get("listings/:id/edit", async (req, res) => {
//     let { id } = req.params;
//     console.log("edit api")
//     const Listing = await listing.findById(id);
//     res.render("./listings/edit.ejs", { Listing });
// })

//show route
app.get("/listings/:id", async (req, res) => {
    console.log("show a particular listing")
    let { id } = req.params;
    const Listing = await listing.findById(id).populate("reviews");

    Listing.reviews.forEach(r => {
        r.formattedDate = moment(r.createdAt).fromNow();
    });

    res.render('listings/show', { layout: false, Listing, title: Listing.title });
})

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    console.log("edit api")
    const Listing = await listing.findById(id);
    res.render("./listings/edit.ejs", { Listing });
})

app.put("/listings/:id", async (req,res) => {
     let { id } = req.params;
     await listing.findByIdAndUpdate(id, {...req.body})
     res.redirect(`/listings/${id}`);
})

//create route
app.post("/listings", validateListing, async (req, res) => {
    const { captchaInput, title, price, location, country, description, image } = req.body;

    if (captchaInput !== req.session.captcha) {
        return res.render("listings/new", { layout:false, title: "Create New Listing", error: "❌ Invalid CAPTCHA" 
        });
    }

    // Proceed with listing creation
    const newListing = new listing({ title, price, location, country, description, image });
    await newListing.save();

    // Optionally reset captcha after successful use
    req.session.captcha = null;

    res.redirect("/listings");
});

app.post("/listings/:id/reviews", validateReview, async (req, res) => {
    const { author, comment, rating } = req.body.review;

    let foundListing = await listing.findById(req.params.id);
    let newReview = new Review({ author, comment, rating });

    foundListing.reviews.push(newReview);

    await newReview.save();
    await foundListing.save();

    console.log("new review saved");
    res.redirect(`/listings/${foundListing._id}`);
});



//Delete route
app.delete("/listings/:id", async (req,res) => {
    let {id} = req.params;
    let deleteListing = await listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})

// //Edit route
// app.get("listings/:id/edit", async (req, res) => {
//     let { id } = req.params;
//     const Listing = await listing.findById(id);
//     res.render("./listings/edit.ejs", { Listing });
// })

//For testing
app.get("/testListing", async (req, res) => {
    let sampleListing = new listing({
        title: "my new home",
        description: "Near the hill",
        price: 1400,
        location: "Risikesh",
        country: "India"
    });

    await sampleListing.save();
    console.log("Data is saved successfully");
    res.send("success");
})

//Delete Route
app.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
    let { id, reviewId } = req.params;
    console.log("deleting one review");

    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
});

// app.post("/listings", async (req, res) => {
//     const userCaptcha = req.body.captchaInput;

//     if (userCaptcha !== req.session.captcha) {
//         return res.send("❌ CAPTCHA does not match. Try again.");
//     }

//     const newListing = new listing(req.body);
//     await newListing.save();
//     res.redirect("/listings");
// });


connectToDatabase().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Connect to MongoDB
async function connectToDatabase() {
    await mongoose.connect('mongodb://localhost:27017/StayTogether');
}

