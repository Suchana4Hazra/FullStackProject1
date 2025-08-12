const listing = require("../models/listing")
const moment = require('moment'); // used in /:id route
const { geocodeAddress } = require('../geocodingConfig'); // Adjust path

module.exports.index = async (req, res) => {
    console.log("list")
    const allListing = await listing.find({});
    res.render('listings/index', { allListing, title: "All Listings" });
}

module.exports.newListing = (req, res) => {
    res.render('listings/new', { layout: false,title: "Add New Listing" });
}

// In your createNewListing function
module.exports.createNewListing = async (req, res) => {
    const { captchaInput } = req.body;
    const { title, price, location, country, description, image } = req.body.listing;
    
    if (captchaInput !== req.session.captcha) {
        return res.render("listings/new", { layout:false, title: "Create New Listing", error: "❌ Invalid CAPTCHA" });
    }
    
    const newListing = new listing({ title, price, location, country, description, image });
    newListing.owner = req.user._id;
    
    // Add geocoding
    try {
        const geoData = await geocodeAddress(location, country);
        newListing.geometry = {
            type: "Point",
            coordinates: geoData.coordinates // [lng, lat]
        };
    } catch (error) {
        console.error('Geocoding failed:', error);
        // Continue without coordinates if geocoding fails
    }
    
    await newListing.save();
    req.session.captcha = null;
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
    console.log("show a particular listing")
    let { id } = req.params;
    const Listing = await listing.findById(id)
              .populate("owner")
              .populate({
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
}

module.exports.editListingForm = async (req, res) => {
    let { id } = req.params;
    console.log("edit api")
    const Listing = await listing.findById(id);
    if(!Listing) {
        req.flash("error","Listing you requested for does not exist")
        res.redirect("/listings")
    }
    res.render("listings/edit", { layout: false, Listing, title: "Edit Listing" });
}

module.exports.editListing = async (req,res) => {
    let { id } = req.params;
    const { location, country } = req.body.listing;
    
    // Update the listing
    await listing.findByIdAndUpdate(id, req.body.listing);
    
    // Update geocoding if location changed
    try {
        const geoData = await geocodeAddress(location, country);
        await listing.findByIdAndUpdate(id, {
            geometry: {
                type: "Point",
                coordinates: geoData.coordinates
            }
        });
    } catch (error) {
        console.error('Geocoding failed during update:', error);
    }
    
    req.flash("success", "Listing is updated successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    let deleteListing = await listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing is Deleted")
    res.redirect("/listings");
}

