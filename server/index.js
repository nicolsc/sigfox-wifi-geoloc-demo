'use strict';
const Hapi = require('hapi');

const sigfox = require('./sigfox');
const google = require('./google');
const slack = require('./slack');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: process.env.PORT || 3000
});

server.route({
  method: 'POST',
  path:'/locations/wifi',
  handler:function(request, reply){
    console.log('[%s] %s', request.method, request.path, request.payload);

    if (!request.payload.data || !request.payload.data.match(/([0-F]{12})*/gi).length){
      return reply("❌").code(400);
    }
    //Sigfox callback : reply 200 as soon as possible
    reply("☺");

    //    const networks = sigfox.decodeSigfoxMessage(request.payload.data);
    var sigfoxMsg = sigfox.message(request.payload);
    google.location(sigfoxMsg)
    .then(slack.post)
    .catch(function(err){
     console.warn("❌", err.message);
     console.log(sigfoxMsg)
     slack.post(sigfoxMsg);
    });
  }
});
server.route({
  method:'POST',
  path:'/locations/spotit',
  handler:function(request, reply){
    console.log('[%s] %s', request.method, request.path, request.payload);
    if (request.payload.lat!==undefined|| request.payload.lng!==undefined || request.payload.radius!==undefined){
      return reply("❌").code(400);
    }
    //Sigfox callback : reply 200 as soon as possible
    reply("☺");

  }
});
// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
