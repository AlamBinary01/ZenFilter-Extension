// index.js

const Hapi = require('@hapi/hapi');
const config = require('./src/config/config');
const authentication = require('./src/routers/authentication');
const connectToMongoDB = require('./src/config/database')

const init = async () => {
    const server = Hapi.server(config.serverOptions);

    await connectToMongoDB();
    authentication(server);

    
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
