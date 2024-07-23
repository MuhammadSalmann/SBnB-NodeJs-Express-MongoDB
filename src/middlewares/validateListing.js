const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require('../schema');

const validateListing = (req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    if(error) {
        const errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }
    next();
}

module.exports = validateListing;