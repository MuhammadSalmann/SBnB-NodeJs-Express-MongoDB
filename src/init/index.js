const mongoose = require('mongoose');
require('dotenv').config();

const initData = require('./data');
const listingModel = require('../models/listing');
const dbConnection = require('../db');

const initDB = async () => {
    dbConnection();
    await listingModel.deleteMany({})
    await listingModel.insertMany(initData.data);
    console.log('Data initialized');
}

initDB();