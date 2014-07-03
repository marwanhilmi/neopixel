// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
 
var tessel = require('tessel');
var fs = require('fs');
var script =  '/../animation.js';
var clone = require('structured-clone')

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
              console.info('Script aborted');
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

var compareAll = function(a, b) {
  for (var i = 0; i < a.length; i++) {
    if (!bufCompare(a[i], b[i])) {
      console.log('failure at index i', a[i], b[i]);
      return;
    }
  }

  console.log('all clear');
}

var bufCompare = function (a, b) {
  if (!Buffer.isBuffer(a)) return undefined;
  if (!Buffer.isBuffer(b)) return undefined;
  if (typeof a.equals === 'function') return a.equals(b);
  if (a.length !== b.length) return false;
  
  for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
  }
  
  return true;
};

function sendAnimation (client) {
  var arr = createAnimation();
  // after = clone.deserialize(clone.serialize(arr));
  // compareAll(arr, after);
  var frameBuf = new Buffer(arr);
  var lengthBuff = new Buffer(4);
  console.log('frame length', arr[0].length);
  lengthBuff.writeUInt32BE(arr[0].length, 0);
  console.log('about to concat')

  var toSend = Buffer.concat([lengthBuff, frameBuf]);
  console.log('sending message...');
  console.log('sending', toSend);
  client.interface.writeProcessMessageRaw(toSend);
  console.log('sent message!');
  // client.once('message', function (m) {
  //   if (m.status = 'complete') {
  //     console.log('fireworks and finished!!');
  //   }
  // });
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