const Gpio = require('pigpio').Gpio;

const motor = new Gpio(4, {mode: Gpio.OUTPUT});

let a = true
setInterval(() => {
  motor.servoWrite(a ? 2500 : 0);
  a = !a
}, 500);