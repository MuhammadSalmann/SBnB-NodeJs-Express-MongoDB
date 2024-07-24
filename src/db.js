const mongoose = require('mongoose');
const Mongo_URL = process.env.MONGO_URL;

module.exports = () => {
    mongoose.connect(Mongo_URL)
    .then(() => {
        console.log('Connected to the database');
        }
    )
    .catch((err) => {
        console.log('Error connecting to the database');
        }
    );
}