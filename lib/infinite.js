
/*!
 * infinite
 * Copyright(c) 2013 Amos Barreto <amos.barreto@gmail.com>
 * MIT Licensed
 */

var util = require('util');
var fork = require('child_process').fork;
var EventEmitter = require('events').EventEmitter;

function Infinite () {
    EventEmitter.call(this);
    this.version = '0.0.1';
    this.handles = {};

    var self = this;
    var listenCount = 0;
    process.on('message', function(m, serverHandle) {
        if (typeof m === 'string' && m in self.handles) {
            var handle = self.handles[m];
            var server = handle.server;
            var args = handle.args;
            var lastArg = args[args.length - 1];
            var cb = typeof lastArg === 'function' ? lastArg : undefined;
            server.once('listening', function () {
                listenCount++;
                if (listenCount === Object.keys(self.handles).length) {
                    process.send('exit');
                }
            });
            server.listen(serverHandle, cb);
        }
    });
}

util.inherits(Infinite, EventEmitter);

Infinite.prototype.forkOn = function forkOn(signal) {
    process.on(signal, function () {
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
                this.emit('exit');
            }
        }.bind(this));

        Object.keys(this.handles).forEach(function (name) {
            child.send(name, this.handles[name].server);
        }.bind(this));
    }.bind(this));
};

Infinite.prototype.register = function register(name, server) {
    var handle = this.handles[name] = { server: server };
    var serverListen = server.listen.bind(server);
    server.listen = function _listen() {
        var args = handle.args = Array.prototype.slice.call(arguments);
        server.listen = serverListen;
        if (!process.env.NODE_WAIT_FOR_SERVER_HANDLE) {
            server.listen.apply(null, args);
        }
    };
};

Infinite.prototype.clear = function clear(name) {
    delete this.handles[name];
};

module.exports = new Infinite();
