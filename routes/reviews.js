const express = require('express')
const router = express.Router()
const Review = require('../models/review.js'); 
const listing = require("../models/listing.js"); 
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


// Create review
router.post("/:id/reviews", isLoggedIn, validateReview, async (req, res) => {
    const { comment, rating } = req.body.review;

    let foundListing = await listing.findById(req.params.id);
    let newReview = new Review({ comment, rating });
    newReview.author = req.user._id;
    console.log(newReview);
    foundListing.reviews.push(newReview);

    await newReview.save();
    await foundListing.save();

    console.log("new review saved");
    req.flash("success","New Review is created successfully")
    res.redirect(`/listings/${foundListing._id}`);
});

// Delete review
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted")
    res.redirect(`/listings/${id}`);
})

module.exports = router;
