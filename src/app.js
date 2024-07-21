const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 8080;
require('./db')();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/testlistings', (req, res) => {
    const Listing = require('./models/listing');
    let sampleListing = new Listing({
        title: 'Test Listing',
        description: 'This is a test listing',
        price: 100,
        location: 'Test Location',
        country: 'Test Country'
    });
    sampleListing.save()
        .then(listing => {
            console.log(listing);
            res.status(201).json(listing);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    console.log('successful testting');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});