const express = require('express') // fixed typo
const router = express.Router()
const listing = require("../models/listing.js")
const moment = require('moment'); // used in /:id route
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");


//Index Route
router.get('/', async (req, res) => {
    console.log("list")
    const allListing = await listing.find({});
    res.render('listings/index', { allListing, title: "All Listings" });
})

//new route
router.get('/new', isLoggedIn, (req, res) => {
    // console.log("new listing");
    res.render('listings/new', { layout: false,title: "Add New Listing" });
})

//create route
router.post("/", isLoggedIn, validateListing, async (req, res) => {
    const { captchaInput } = req.body;
    const { title, price, location, country, description, image } = req.body.listing;

    if (captchaInput !== req.session.captcha) {
        return res.render("listings/new", { layout:false, title: "Create New Listing", error: "❌ Invalid CAPTCHA" });
    }

    const newListing = new listing({ title, price, location, country, description, image });
    newListing.owner = req.user._id;
    await newListing.save();

    req.session.captcha = null;
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings");
});

//show route
router.get("/:id", async (req, res) => {
    console.log("show a particular listing")
    let { id } = req.params;
    const Listing = await listing.findById(id).
              populate({
                path: "reviews",
                populate: {
                    path: "author",
                },
              })
    console.log(Listing);
    if(!Listing) {
        req.flash("error","Listing you requested for does not exist")
        res.redirect("/listings")
    }

    Listing.reviews.forEach(r => {
        r.formattedDate = moment(r.createdAt).fromNow();
    });

    res.render('listings/show', { layout: false, Listing, title: Listing.title });
})

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    console.log("edit api")
    const Listing = await listing.findById(id);
    if(!Listing) {
        req.flash("error","Listing you requested for does not exist")
        res.redirect("/listings")
    }
    res.render("listings/edit", { layout: false, Listing, title: "Edit Listing" });
})

//update route
router.put("/:id", isLoggedIn, isOwner, async (req,res) => {
     let { id } = req.params;
     await listing.findByIdAndUpdate(id, req.body.listing)
     req.flash("success", "Listing is updated successfully")
     res.redirect(`/listings/${id}`);
})

//Delete route
router.delete("/:id", isLoggedIn, isOwner, async (req,res) => {
    let {id} = req.params;
    let deleteListing = await listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing is Deleted")
    res.redirect("/listings");
})

module.exports = router