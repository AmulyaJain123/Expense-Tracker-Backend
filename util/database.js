const mongoose = require('mongoose');


const connectToDB = async () => {
    try {
        const str = process.env.STATUS === 'dev' ? process.env.CONNECTION_STR_DEV : process.env.CONNECTION_STR_PROD;
        await mongoose.connect(str);
    } catch (error) {
        throw error;
    }
}

exports.connectToDB = connectToDB;