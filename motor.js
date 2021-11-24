const Gpio = require('pigpio').Gpio;
const fs = require("fs")
const motorInfo = require('./data/motor.json')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 모터 정보 로딩
const motorsInfo = {}
for (let model in motorInfo) {
  motorsInfo[model] = []
  for (let motor of motorInfo[model].motors) {
    motorsInfo[model].push(new Gpio(motor, {mode: Gpio.OUTPUT}))
    // motorsInfo[model].push(motor)
  }
}

// 모터 테스트
;(async () => {
  for (let model in motorsInfo) {
    for (let motor of motorsInfo[model]) {
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
            for (let motor of motorsInfo[jsonData.kind]) {
                console.log(jsonData.kind)
                motor.servoWrite(2500);
                await sleep(1000)
                motor.servoWrite(500);
                await sleep(1000)
            }
        }
    }
})()