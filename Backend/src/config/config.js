
require('dotenv').config();
const mongoDB=process.env.MONGODB_URI;
module.exports = {
    mongoDBUrl: mongoDB,
    serverOptions: {
        port: 3001,
        host: 'localhost',
    },
};
