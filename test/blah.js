//var async = require('async');
var http = require('http');
var infinite = require('../index.js');

infinite.forkOn('SIGTERM');

var httpServer1 = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('server1 okay');
});

infinite.register('httpServer1', httpServer1);
httpServer1.listen(1337, 'localhost', function () {
    console.log('httpServer1 listening');
});

var httpServer2 = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('server2 okay');
});

infinite.register('httpServer2', httpServer2);
httpServer2.listen(1338, 'localhost', function () {
    console.log('httpServer2 listening');
});

infinite.on('exit', function () {
    console.log('on exit');
    //async.parallel([
    //    httpServer1.close.bind(httpServer1),
    //    httpServer2.close.bind(httpServer2),
    //], function (err) {
    //    if (err) console.log(err);
    //});
    httpServer1.close(function () {
        console.log('httpServer1 close');
        httpServer2.close(function () {
            console.log('httpServer2 close');
            process.exit();
        });
    });
});
