const express = require('express');
const listingRouter = express.Router();
const validateListing = require('../middlewares/validateListing');
const {listingIndexRoute, listingNewRoute, listingShowRoute, listingEditPage, createListing, updateListing, deleteListing} = require('../controllers/listingController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const isOwner = require('../middlewares/isOwner');

//Index Route
listingRouter.get('/', listingIndexRoute);

// New Listing Route
listingRouter.get('/new', isLoggedIn, listingNewRoute);

//Show Route
listingRouter.get('/:id', listingShowRoute);

// Edit Page
listingRouter.get('/:id/edit', isLoggedIn, isOwner, listingEditPage);

// Add Listing Route
listingRouter.post('/', isLoggedIn, validateListing, createListing);

// Update Route
listingRouter.put('/:id', isLoggedIn, isOwner, validateListing, updateListing);

// Delete Route
listingRouter.delete('/:id', isLoggedIn, isOwner, deleteListing);

module.exports = listingRouter;