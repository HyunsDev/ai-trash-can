const fs = require("fs")
const motorList = require('./data/motor.json')

let Gpio
if (process.env.NODE_ENV != "development") {
  Gpio = require('pigpio').Gpio;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 개발용 모터 시뮬레이션 클래스
class virtualMotor {
  constructor(e) {
    this.motorId = e
  }

  servoWrite(angle) {
    console.log(`[${this.motorId}] ${angle}hz`)
  }
}

// 모터 클래스
class Motor {
  constructor(gpio, name) {
    this.name = name
    this.motors = gpio.map(e => {
      console.log(`${e} GPIO added to ${name} Group`)
      if (process.env.NODE_ENV == "development") {
        return new virtualMotor(e)
      } else {
        return new Gpio(e, { mode: Gpio.OUTPUT })
      }

    })
    this.isOpen = false
  }

  async open(force = false) {
    if (!this.isOpen || force) {
      console.log(`Open ${this.name}`)
      this.isOpen = true
      this.motors.forEach(async e => {
        e.servoWrite(motorList.config['open-angle']);
        await sleep(500);
        e.servoWrite(0);
      });

      return true
    } else {
      return false
    }
  }

  async close(force = false) {
    if (this.isOpen || force) {
      console.log(`Close ${this.name}`)
      this.isOpen = false
      this.motors.forEach(async e => {
        e.servoWrite(motorList.config['close-angle']);
        await sleep(500);
        e.servoWrite(0);
      });
      return true
    } else {
      return false
    }
  }
}




; (async () => {
  const motorInfo = {}

  // 모터 로딩
  for (let model in motorList.motors) {
    const motor = new Motor(motorList.motors[model].motors, model)
    motorInfo[model] = motor

    // 모터 테스트
    console.log(`${model} TEST - Open`)
    await motor.open()
    await sleep(2000)
    console.log(`${model} TEST - Close`)
    await motor.close()
    await sleep(2000)
  }
})()


