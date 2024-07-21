const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 8080;
const path = require('path');
const methodOverride = require('method-override');
const Listing = require('./models/listing');
require('./db')();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); // This is for using PUT and DELETE requests


app.get('/', (req, res) => {
    res.send('Hello World');
});

//Index Route
app.get('/listings', async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', {allListings});
});

// New Listing Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

//Show Route
app.get('/listings/:id', async (req, res) => {
    const {id} = req.params;
    console.log(req.params.id);
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', {listing});
})

// Add Listing Route
app.post('/listings', async (req, res) => {
    //const {title, description, price, location, country} = req.body;
    console.log(req.body.listing);
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect('/listings');
});

// Edit Page
app.get('/listings/:id/edit', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing});
});

// Update Route
app.put('/listings/:id', async (req, res) => {
    const {id} = req.params;
    //console.log({...req.body.listing});
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete('/listings/:id', async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

// app.get('/testlistings', (req, res) => {
//     const Listing = require('./models/listing');
//     let sampleListing = new Listing({
//         title: 'Test Listing',
//         description: 'This is a test listing',
//         price: 100,
//         location: 'Test Location',
//         country: 'Test Country'
//     });
//     sampleListing.save()
//         .then(listing => {
//             console.log(listing);
//             res.status(201).json(listing);
//         })
//         .catch(err => {
//             res.status(500).json({ error: err });
//         });
//     console.log('successful testting');
// });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});