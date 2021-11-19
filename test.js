const Gpio = require('pigpio').Gpio;

const motor = new Gpio(4, {mode: Gpio.OUTPUT});

let a = true
setInterval(() => {
  motor.servoWrite(a ? 2200 : 500);
  a = !a
}, 1000);