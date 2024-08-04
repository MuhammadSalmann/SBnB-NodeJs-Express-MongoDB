require('dotenv').config();
const initData = require('./data');
const listingModel = require('../models/listing');
const dbConnection = require('../db');

const initDB = async () => {
    dbConnection();
    await listingModel.deleteMany({})
    console.log('Data deleted');
    initData.data = initData.data.map(obj => ({...obj, owner: process.env.OWNER_ID}));
    await listingModel.insertMany(initData.data);
    console.log('Data initialized');
}

initDB();