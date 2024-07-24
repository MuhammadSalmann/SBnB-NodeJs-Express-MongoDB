const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schema');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }
    next();
}

module.exports = validateReview;