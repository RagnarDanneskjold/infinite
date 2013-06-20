
# node-infinite [![Build Status](https://travis-ci.org/uber/infinite.png?branch=master)](https://travis-ci.org/uber/infinite)

  Zero-downtime server restarts for Node.js

## Usage

```javascript
var http = require('http');
var infinite = require('node-infinite');

// Invoke infinite restart on SIGTERM
infinite.forkOn('SIGTERM');

var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('okay');
});

// Register the server handle to send to forked process
infinite.register('httpServer', server);

// Listen only after registering
server.listen(1337, 'localhost');
```

## TODO

Support to TCP servers and sockets

## License

(The MIT License)

Copyright (c) 2013 Amos Barreto <amos.barreto@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
