const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');

const addReview = wrapAsync(async (req, res) => {
    //const {id} = req.params;
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id
    listing.reviews.push(newReview);
    const review = await newReview.save();
    console.log(review);
    await listing.save();
    req.flash('success', 'New Review Added');
    res.redirect(`/listings/${listing._id}`);
});

const deleteReview = wrapAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    console.log(req.params);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });  // this statement means remove the reviewId from the reviews array in the Listing
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted');
    res.redirect(`/listings/${id}`);
});

module.exports = { addReview, deleteReview };