const Gpio = require('pigpio').Gpio;

const motor = new Gpio(4, {mode: Gpio.OUTPUT});

let pulseWidth = 1000;
let increment = 100;

setInterval(() => {
  motor.servoWrite(pulseWidth);

  pulseWidth += increment;
  if (pulseWidth >= 1700) {
    increment = -1;
  } else if (pulseWidth <= 500) {
    increment = 1;
  }
}, 11);