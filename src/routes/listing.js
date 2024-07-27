const express = require('express');
const listingRouter = express.Router();
const validateListing = require('../middlewares/validateListing');
const {listingIndexRoute, listingNewRoute, listingShowRoute, listingEditPage, createListing, updateListing, deleteListing} = require('../controllers/listingController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const isOwner = require('../middlewares/isOwner');
const multer  = require('multer')
const { storage } = require('../cloudConfig');
const upload = multer({ storage })

listingRouter.route('/')
.get(listingIndexRoute)
.post(isLoggedIn, upload.single('listing[image]'), validateListing, createListing);


listingRouter.route('/new')  
.get(isLoggedIn, listingNewRoute);

listingRouter.route('/:id')
.get(listingShowRoute)
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, updateListing)
.delete(isLoggedIn, isOwner, deleteListing);

listingRouter.get('/:id/edit', isLoggedIn, isOwner, listingEditPage);


module.exports = listingRouter;