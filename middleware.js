const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require('./schema.js')
const ExpressError = require("./utils/ExpressError.js")


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        // Save the URL they were trying to access
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // Important: Clear it from session
    } else {
        res.locals.redirectUrl = '/listings'; // Fallback URL
    }
    next();
}

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error","You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id, reviewId} = req.params;
    
    // Debug logging
    console.log("Listing ID:", id);
    console.log("Review ID:", reviewId);
    
    let review = await Review.findById(reviewId);
    console.log("Found review:", review);
    
    if(!review) {
        req.flash("error","Review not found");
        return res.redirect(`/listings/${id}`);
    }
    
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","You are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}