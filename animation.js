// var hw = process.binding('hw');

function tracer() {
  var numLEDs = 2;//30*4;
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


// function whiteStripes(num) {
//   var frame = new Buffer(num * 3);
//   frame.fill(0xff);
//   return [frame];
// }

// function incrStripe(num) {
//   var frame = new Buffer(num * 3);
//   for (var i = 0; i < frame.length; i++) {
//     frame[i] = (i + 1);
//   }
//   return [frame];
// }


// var arr1 = whiteStripes(120);
// var arr2 = tracer();
// var toAnimate;

process.on('raw-message', function(msg) {
  console.log('Got animation. Beginning to animate');
  // toAnimate = msg.fireworks;
  console.log(msg);
  console.log('framelength', msg.readUInt32BE(0));
  // beginCompareBufArrays(toAnimate, arr2);
  // hw.neopixel_animation_buffer(toAnimate);
})

console.log('waiting for message');

process.ref();

var beginCompareBufArrays = function(a, b) {
  if (a.length != b.length) {
    console.log('the arrays have different lengths');
    return -1;
  }

  for (var i = 0; i < a.length; i++) {
    if (!bufCompare(a[i], b[i])) {
      console.log("The buffers are different at index", i, a[i], 'with length', a[i].length, b[i], 'with length', b[i].length);
      return -1;
    }
  }

  console.log('the arrays of buffers are the same.');

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




// // hw.neopixel_animation_buffer(arr2);


// // When the animation completes, just do it again
// process.on('neopixel_animation_complete', hw.neopixel_animation_buffer.bind(this, toAnimate));


