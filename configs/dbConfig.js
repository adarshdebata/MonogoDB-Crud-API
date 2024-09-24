const { MongoClient } = require('mongodb');

require('dotenv').config();

// Retrive MongoDB connection URI (MongoDB connection URI)
const uri = process.env.MONGO_URI

const client = new MongoClient(uri, {
    connectTimeoutMS: 10000, // Timeout for initial connection attempt
});

let db; // Variable to store the MongoDB database instance

const connectDB = async () => {
        if (db) return db;

    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('Mongo DB connected Sucessfully');
        return db;
    } catch (error) {
        console.error('Unable to connect with Database', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;