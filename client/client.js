// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
 
var tessel = require('tessel');
var fs = require('fs');
var script =  '/tessel/animation.js';

console.log(__dirname);
tessel.findTessel(null, true, function(err, client) {
    if (err) throw err;
    client.run(__dirname + script, ['tessel', script], {
          single: true,
        }, function () {
          client.stdout.resume();
          client.stdout.pipe(process.stdout);
          client.stderr.resume();
          client.stderr.pipe(process.stderr);
          console.info('Running script...');
 
          sendAnimation(client);
 
          // Stop on Ctrl+C.
          process.on('SIGINT', function() {
            setTimeout(function () {
              logs.info('Script aborted');
              process.exit(131);
            }, 200);
            client.stop();
          });
 
          client.once('script-stop', function (code) {
            client.close(function () {
              process.exit(code);
            });
          });
    });
});

function sendAnimation (client) {
  var arr = createAnimation();
  var fireworks = [arr, null, null];
  client.interface.writeProcessMessage({fireworks:fireworks})
  client.once('message', function (m) {
    if (m.status = 'complete') {
      console.log('fireworks and finished!!');
    }
  });
}

function createAnimation() {
  var numLEDs = 30*4;
  var trail = 5;
  var arr = new Array(numLEDs);
  for (var i = 0; i < numLEDs; i++) {
    var buf = new Buffer(numLEDs * 3);
    buf.fill(0);
    for (var col = 0; col < 3; col++){
      for (var k = 0; k < trail; k++) {
        buf[(3*(i+numLEDs*col/3)+col+1 +3*k)] = 0xFF*(trail-k)/trail;
      }
    }
    arr[i] = buf;
  }
  return arr;
}