const express = require('express')
const router = express.Router() 
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../Controller/review.js")

// Create review
router.post("/:id/reviews", isLoggedIn, validateReview, reviewController.createReview);

// Delete review
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, reviewController.deleteReview);

module.exports = router;
