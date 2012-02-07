/*jslint node: true */
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});

var wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
};

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    var files = ['images/foxkeh-fx3.png', 'images/firefox_logo.jpg'],
        index = 0;
    
    var connection = request.accept(null, request.origin);

    var sendFile = function () {
        require('fs').readFile(files[index], function (err, data) {
          if (!err) {
            connection.sendUTF(encodeURIComponent(JSON.stringify({type: 'image/png',data: data.toString('base64')})) + "\r\n\r\n");
          }
        });
        index = index === 0 ? 1 : 0;
    };
    var interval;

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            switch (message.utf8Data) {
            case 'load':
                if (!interval) {
                    interval = setInterval(sendFile, 3000);
                    sendFile();
                }
                break;
            case 'noload':
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
                break;
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    });
});

