var cp = require('child_process');
var testProc;
var testProcPid;

exports.testStart = function (test) {
    testProc = cp.fork('test/dualHttpServer.js');//, null, {detached: true});
    testProcPid = testProc.pid;
    setTimeout(test.done, 100);
};

exports.testCurl = function (test) {
    test.expect(2);
    cp.exec('curl localhost:1338', function (error, stdout) {
        test.equal(stdout, 'okay1');
        cp.exec('curl localhost:1339', function (error, stdout) {
            test.equal(stdout, 'okay2');
            test.done();
        });
    });
};

exports.testCurlAfterRestart = function (test) {
    test.expect(2);
    cp.exec('kill ' + testProcPid, function () {
        setTimeout(function () {
            cp.exec('curl localhost:1338', function (error, stdout) {
                test.equal(stdout, 'okay1');
                cp.exec('curl localhost:1339', function (error, stdout) {
                    test.equal(stdout, 'okay2');
                    test.done();
                });
            });
        }, 100);
    });
};
