if(process.env.NODE_ENV !== 'production') { // This is for using the .env file in development mode
    require('dotenv').config();
}

// Imports
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const Session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Routers
const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user');

// Database Connection
require('./db')();

// Mongo Store Configuration
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SECRET,
    },
});

store.on('error', (e) => {
    console.log('Session Store Error', e);
});

// Session Configuration
const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

// Middlewares
app.set('view engine', 'ejs'); // This is for setting the view engine
app.set('views', path.join(__dirname, 'views')); // This is for setting the views directory
app.use(express.static(path.join(__dirname, 'public'))); // This is for serving static files like css, images, etc.
app.use(express.urlencoded({ extended: true }));  // This is for parsing form data
app.use(express.json());  // This is for parsing JSON data
app.use(methodOverride('_method')); // This is for using PUT and DELETE requests
app.engine('ejs', ejsMate); // This is for using ejs-mate as the view engine
app.use(Session(sessionConfig)); // This is for using sessions
app.use(flash()); // This is for using flash messages
app.use(passport.initialize()); // This is for initializing passport
app.use(passport.session()); // This is for using passport sessions

passport.use(new LocalStrategy(User.authenticate())); // This is for using passport-local strategy for authentication
passport.serializeUser(User.serializeUser()); // This is for serializing the user
passport.deserializeUser(User.deserializeUser()); // This is for deserializing the user

// Middleware for logging requests
app.use('/', (req, res, next) => {
    console.log(req.method, req.hostname, req.path);
    next();
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome The Project the Running ... Go to /listings to see the listings');
});

// Routes
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);


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