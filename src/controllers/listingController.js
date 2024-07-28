const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});

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
    const listing = await Listing.findById(id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        },
    })
    .populate('owner');
    if(!listing){
        req.flash('error', 'Cannot find that listing');
        return res.redirect('/listings');
    }
    // console.log(listing);
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
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_200,h_200,c_thumb,g_face,r_max,b_rgb:262c35');
    res.render('listings/edit.ejs', {listing, originalImageUrl});
});

// Add Listing Route
const createListing = wrapAsync(async (req, res, next) => {
    //const {title, description, price, location, country} = req.body;
    //console.log(req.body.listing);
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      }).send();

    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;  // Add the owner to the listing
    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }; // Add the image to the listing
    }
    listing.geometry = response.body.features[0].geometry;
    await listing.save();
    req.flash('success', 'New Listing Added');
    res.redirect('/listings');
});

// Update Route
const updateListing = wrapAsync(async (req, res) => {
    const {id} = req.params;
    //console.log({...req.body.listing});
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }; // Add the image to the listing
        await listing.save();
    }
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