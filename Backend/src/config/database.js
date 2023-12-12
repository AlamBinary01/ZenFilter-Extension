// db.js

const mongoose = require('mongoose');
const { mongoDBUrl } = require('./config');

async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoDBUrl);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = connectToMongoDB;
