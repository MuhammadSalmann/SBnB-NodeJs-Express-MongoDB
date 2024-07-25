const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');

//Index Route
const listingIndexRoute = wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', {allListings});
});

// New Listing Route
const listingNewRoute = (req, res) => {
    res.render('listings/new.ejs');
};

//Show Route
const listingShowRoute = wrapAsync(async (req, res) => {
    const {id} = req.params;
    // console.log(req.params.id);
    const listing = await Listing.findById(id).populate('reviews');
    if(!listing){
        req.flash('error', 'Cannot find that listing');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', {listing});
});

// Edit Route
const listingEditPage = wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Cannot find that listing');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', {listing});
});

// Add Listing Route
const createListing = wrapAsync(async (req, res, next) => {
    //const {title, description, price, location, country} = req.body;
    //console.log(req.body.listing);
    const listing = new Listing(req.body.listing);
    await listing.save();
    req.flash('success', 'New Listing Added');
    res.redirect('/listings');
});

// Update Route
const updateListing = wrapAsync(async (req, res) => {
    const {id} = req.params;
    //console.log({...req.body.listing});
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success', 'Listing Updated');
    res.redirect(`/listings/${id}`);
});

// Delete Route
const deleteListing = wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted');
    res.redirect('/listings');
});

module.exports = {
    listingIndexRoute,
    listingNewRoute,
    listingShowRoute,
    listingEditPage,
    createListing,
    updateListing,
    deleteListing
};