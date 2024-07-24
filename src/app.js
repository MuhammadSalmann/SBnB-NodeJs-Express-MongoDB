require('dotenv').config();
// Imports
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

// Routers
const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');

// Database Connection
require('./db')();

// Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // This is for serving static files like css, images, etc.
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(methodOverride('_method')); // This is for using PUT and DELETE requests
app.engine('ejs', ejsMate); // This is for using ejs-mate as the view engine

// Middleware for logging requests
app.use('/', (req, res, next) => {
    console.log(req.method, req.hostname, req.path);
    next();
});

// Home Route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Routes
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);


// 404 Route: For Wrong URL
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    let {statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).render('error.ejs', {message});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});