const Listing = require('../models/listing');

const isOwner = async (req, res, next) =>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash('error', 'You are not authorized to do that');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = isOwner;