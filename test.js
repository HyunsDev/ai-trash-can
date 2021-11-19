const Gpio = require('pigpio').Gpio;

const motor = new Gpio(4, {mode: Gpio.OUTPUT});

let a = true
setInterval(() => {
  motor.servoWrite(a ? 1700 : 500);
  a = !a
}, 1500);