const mongoose = require('mongoose');
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
        type: String,
        default: defaultImag,
        set: url => url === '' ? defaultImag : url,
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
});

module.exports = mongoose.model('Listing', listingSchema, 'Listings');