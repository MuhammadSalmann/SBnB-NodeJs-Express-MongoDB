const express = require('express');
const app = express();
require('dotenv').config();

// Imports
const port = process.env.PORT || 8080;
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Listing = require('./models/listing');
const Review = require('./models/review');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const validateListing = require('./middlewares/validateListing');
const validateReview = require('./middlewares/validateReview');

// Database Connection
require('./db')();

// Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // This is for serving static files like css, images, etc.
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(methodOverride('_method')); // This is for using PUT and DELETE requests
app.engine('ejs', ejsMate); // This is for using ejs-mate as the view engine

// Middleware for logging requests
app.use('/', (req, res, next) => {
    console.log(req.method, req.hostname, req.path);
    next();
});

// Routes

// Home Route
app.get('/', (req, res) => {
    res.send('Hello World');
});

//Index Route
app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', {allListings});
}));

// New Listing Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

//Show Route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    // console.log(req.params.id);
    const listing = await Listing.findById(id).populate('reviews');
    res.render('listings/show.ejs', {listing});
}));

// Add Listing Route
app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
    //const {title, description, price, location, country} = req.body;
    // console.log(req.body.listing);
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect('/listings');
}));

// Edit Page
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing});
}));

// Update Route
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
    const {id} = req.params;
    //console.log({...req.body.listing});
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// Add Review Route
app.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => {
    //const {id} = req.params;
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

// app.get('/testlistings', (req, res) => {
//     const Listing = require('./models/listing');
//     let sampleListing = new Listing({
//         title: 'Test Listing',
//         description: 'This is a test listing',
//         price: 100,
//         location: 'Test Location',
//         country: 'Test Country'
//     });
//     sampleListing.save()
//         .then(listing => {
//             console.log(listing);
//             res.status(201).json(listing);
//         })
//         .catch(err => {
//             res.status(500).json({ error: err });
//         });
//     console.log('successful testting');
// });

// 404 Route: For Wrong URL
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    let {statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).render('error.ejs', {message});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});