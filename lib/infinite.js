
/*!
 * infinite
 * Copyright(c) 2013 Amos Barreto <amos.barreto@gmail.com>
 * MIT Licensed
 */

/**
 * Library version.
 */

var util = require('util');
var fork = require('child_process').fork;

var handles = {};
var listenCount = 0;
var EventEmitter = require('events').EventEmitter;
var exports = module.exports = new EventEmitter();

exports.version = '0.0.1';

process.on('message', function(m, serverHandle) {
    console.log(m);
    if (typeof m === 'string' && m in handles) {
        var handle = handles[m];
        var server = handle.server;
        var args = handle.args;
        var lastArg = args[args.length - 1];
        var cb = typeof lastArg === 'function' ? lastArg : undefined;
        server.once('listening', function () {
            listenCount++;
            console.log('listenCount: ' + listenCount);
            console.log('goal: ' + Object.keys(handles).length);
            if (listenCount === Object.keys(handles).length) {
                console.log('sendExit');
                process.send('exit');
            }
        });
        console.log('here2');
        server.listen(serverHandle, cb);
    }
});

exports.forkOn = function forkOn(signal) {
    process.on(signal, function () {
        console.log(signal);
        console.dir(Object.keys(handles));
        var settings = {
            exec: process.argv[1],
            execArgv: process.execArgv,
            args: process.argv.slice(2),
            silent: false
        };

        var envCopy = util._extend({}, process.env);
        envCopy.NODE_WAIT_FOR_SERVER_HANDLE = 1;

        var child = fork(settings.exec, settings.args, {
            'env': envCopy,
            'execArgv': settings.execArgv,
            'detached': true
        });

        child.on('message', function (m) {
            if (m === 'exit') {
                exports.emit('exit');
            }
        });

        console.dir(Object.keys(handles));
        Object.keys(handles).forEach(function (name) {
            child.send(name, handles[name].server);
        });
    });
};

exports.register = function register(name, server) {
    var handle = handles[name] = { server: server };
    var serverListen = server.listen.bind(server);
    server.listen = function _listen() {
        var args = handle.args = Array.prototype.slice.call(arguments);
        server.listen = serverListen;
        if (!process.env.NODE_WAIT_FOR_SERVER_HANDLE) {
            console.log('here3');
            server.listen.apply(null, args);
        }
    };
};

exports.clear = function clear(name) {
    delete handles[name];
};
