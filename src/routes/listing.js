const express = require('express');
const listingRouter = express.Router();
const validateListing = require('../middlewares/validateListing');
const {listingIndexRoute, listingNewRoute, listingShowRoute, listingEditPage, createListing, updateListing, deleteListing} = require('../controllers/listingController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const isOwner = require('../middlewares/isOwner');

listingRouter.route('/')
.get(listingIndexRoute)
.post(isLoggedIn, validateListing, createListing);

listingRouter.route('/new')  
.get(isLoggedIn, listingNewRoute);

listingRouter.route('/:id')
.get(listingShowRoute)
.put(isLoggedIn, isOwner, validateListing, updateListing)
.delete(isLoggedIn, isOwner, deleteListing);

module.exports = listingRouter;