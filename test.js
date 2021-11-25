const Gpio = require('pigpio').Gpio;
const motorList = require('./data/motor.json')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class Motor {
  constructor(gpio, name) {
    this.name = name
    this.motors = gpio.map(e => {
      console.log(`${e} GPIO added to ${name} Group`)
      return new Gpio(e, { mode: Gpio.OUTPUT })
    })
    this.isOpen = false
  }

  open(force = false) {
    if (!this.isOpen || force) {
      console.log(`Open ${this.name}`)
      this.isOpen = true
      this.motors.forEach(e => {
        e.servoWrite(motorList.config['open-angle']);
        e.servoWrite(0);
      });

      return true
    } else {
      return false
    }
  }

  close(force = false) {
    if (this.isOpen || force) {
      console.log(`Close ${this.name}`)
      this.isOpen = false
      this.motors.forEach(e => {
        e.servoWrite(motorList.config['close-angle']);
        e.servoWrite(0);
      });
      return true
    } else {
      return false
    }
  }
}

// 모터 로딩
const motorInfo = {}
;(async () => {
  for (let model in motorList.motors) {
    const motor = new Motor(motorList.motors[model].motors, model)
    motorInfo[model] = motor

    // 모터 테스트
    console.log(`${model} TEST - Open`)
    motor.open()
    await sleep(2000)
    console.log(`${model} TEST - Close`)
    motor.close()
    await sleep(2000)
  }
})()