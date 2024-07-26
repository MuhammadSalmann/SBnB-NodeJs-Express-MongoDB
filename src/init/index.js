const mongoose = require('mongoose');
require('dotenv').config();

const initData = require('./data');
const listingModel = require('../models/listing');
const dbConnection = require('../db');

const initDB = async () => {
    dbConnection();
    await listingModel.deleteMany({})
    console.log('Data deleted');
    initData.data = initData.data.map(obj => ({...obj, owner: "66a2a0bea4cd6f9a96ae298a"}));
    await listingModel.insertMany(initData.data);
    console.log('Data initialized');
}

initDB();