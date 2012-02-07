/*jslint node: true*/
var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
    var serveFile = function (file) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        fs.readFile(file, function (er, data) {
            if (er) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('File not found');
                return;
            }
            if (/js$/.test(file)) {
                res.writeHead(200, {'Content-Type': 'text/javascript'});
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
            }
            res.end(data.toString('utf-8'));
        });
    };
    if (req.url === '/') {
        serveFile('./index.html');
    } else {
        serveFile('.' + req.url);
    }
}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');
