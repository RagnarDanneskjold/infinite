var http = require('http');
var infinite = require('../index.js');

infinite.forkOn('SIGTERM');

var httpServer1 = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('okay1');
});

infinite.register('httpServer1', httpServer1);
httpServer1.listen(1338, 'localhost');

var httpServer2 = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('okay2');
});

infinite.register('httpServer2', httpServer2);
httpServer2.listen(1339, 'localhost');

infinite.on('exit', function () {
    httpServer1.close(function () {
        httpServer2.close(function () {
            process.exit();
        });
    });
});

setTimeout(process.exit, 3000);
