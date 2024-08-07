const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const defaultImag = 'https://images.unsplash.com/photo-1544894079-e81a9eb1da8b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const listingSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: {
            type: String,
            default: defaultImag,
            set: url => url === '' ? defaultImag : url,
        },
        filename: String,
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // GeoJSON( MongoDB supports GeoJSON objects as values of geospatial queries)
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

// Mongoose Middleware to delete reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model('Listing', listingSchema, 'Listings');