var http = require('http');
var infinite = require('../index.js');

infinite.forkOn('SIGTERM');

var httpServer1 = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('okay');
});

infinite.register('httpServer1', httpServer1);
httpServer1.listen(1337, 'localhost');

infinite.on('exit', function () {
    console.log('exit');
    httpServer1.close(function () {
        process.exit();
    });
});

setTimeout(process.exit, 2000);
