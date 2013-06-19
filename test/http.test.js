var cp = require('child_process');
var testProc;
var testProcPid;

exports.testStart = function (test) {
    testProc = cp.fork('test/httpServer.js');//, null, {detached: true});
    testProcPid = testProc.pid;
    setTimeout(test.done, 100);
};

exports.testCurl = function (test) {
    test.expect(1);
    cp.exec('curl localhost:1337', function (error, stdout) {
        test.equal(stdout, 'okay');
        test.done();
    });
};

exports.testCurlAfterRestart = function (test) {
    test.expect(1);
    cp.exec('kill ' + testProcPid, function () {
        setTimeout(function () {
            cp.exec('curl localhost:1337', function (error, stdout) {
                test.equal(stdout, 'okay');
                test.done();
            });
        }, 100);
    });
};
