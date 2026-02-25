const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const test = async () => {
    try {
        console.log('Attempting to connect to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully!');
        fs.writeFileSync('conn_result.txt', 'SUCCESS: Connected to MongoDB');
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        fs.writeFileSync('conn_result.txt', 'FAILURE: ' + err.message + '\n' + err.stack);
        process.exit(1);
    }
};

test();
