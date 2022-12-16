const express = require('express');
const router = express.Router( {mergeParams: true}); // mergeParams: true - so that  when you want to leave a review, it would not complain that those are set to null
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const Winning = require('../models/winning');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//this one below for deleting specific review, look for $pull in Docs
router.delete('/:atsauksmeId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;