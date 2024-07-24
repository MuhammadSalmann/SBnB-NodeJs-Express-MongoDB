const express = require('express');
const reviewRouter = express.Router( {mergeParams: true} ); // This is for accessing the params from the parent router
const validateReview = require('../middlewares/validateReview');
const { deleteReview, addReview } = require('../controllers/reviewController');

reviewRouter.post('/', validateReview, addReview);
reviewRouter.delete('/:reviewId', deleteReview);

module.exports = reviewRouter;