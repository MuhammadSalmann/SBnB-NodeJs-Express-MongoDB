const express = require('express');
const listingRouter = express.Router();
const validateListing = require('../middlewares/validateListing');
const {listingIndexRoute, listingNewRoute, listingShowRoute, listingEditPage, createListing, updateListing, deleteListing} = require('../controllers/listingController');

//Index Route
listingRouter.get('/', listingIndexRoute);

// New Listing Route
listingRouter.get('/new', listingNewRoute);

//Show Route
listingRouter.get('/:id', listingShowRoute);

// Edit Page
listingRouter.get('/:id/edit', listingEditPage);

// Add Listing Route
listingRouter.post('/', validateListing, createListing);

// Update Route
listingRouter.put('/:id', validateListing, updateListing);

// Delete Route
listingRouter.delete('/:id', deleteListing);

module.exports = listingRouter;