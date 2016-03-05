/**
* @author Aju John
* Avagaman entry point
*/
var hapi = require('hapi');
require('dotenv').load();

var server = module.exports = new hapi.Server();

server.connection({
     routes: {
        cors: true
    },
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT
});


require("./database");
require("./modules");
require("./authentication"),


server.start(function() {
    console.log(process.env.APP_SAYS + " Server running at: " + server.info.uri);
});