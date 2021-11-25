const Gpio = require('pigpio').Gpio;
const fs = require("fs")
const motorList = require('./data/motor.json')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 모터 로딩
const motorInfo = {}
for (let model in motorList) {
  motorInfo[model] = []
  for (let motor of motorList[model].motors) {
    motorInfo[model].push(new Gpio(motor, {mode: Gpio.OUTPUT}))
  }
}

// 모터 테스트
;(async () => {
  for (let model in motorInfo) {
    for (let motor of motorInfo[model]) {
      console.log(model)
      motor.servoWrite(2500);
      await sleep(1000)
      motor.servoWrite(500);
      await sleep(1000)
    }
    await sleep(1000)
  }
})()

;(async () => {
    while (true) {
        const jsonFile = fs.readFileSync('data.txt', 'utf8');
        const jsonData = JSON.parse(jsonFile);

        if (jsonData.status == "found") {
            for (let kind in motorList) {
                for (let motor of motorInfo[kind]) {
                  if (kind == jsonData.kind) {
                    motor.servoWrite(2500);
                  } else {
                    motor.servoWrite(500);
                  }
              }
            }
        }
        await sleep(200)
    }
})()