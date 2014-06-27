var hw = process.binding('hw');
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

console.log("About to start animating...");

// Start the animation
hw.neopixel_animation_buffer.call(this , arr);

// When the animation completes, just do it again
process.on('neopixel_animation_complete', hw.neopixel_animation_buffer.bind(this,arr));
