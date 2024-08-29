const express = require('express');
const reviewRouter = express.Router( {mergeParams: true} ); // This is for accessing the params from the parent router
const validateReview = require('../middlewares/validateReview');
const { deleteReview, addReview } = require('../controllers/reviewController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const { isReviewAuthor } = require('../middlewares/isReviewAuthor');

reviewRouter.post('/', isLoggedIn, validateReview, addReview);
reviewRouter.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview);

module.exports = reviewRouter;