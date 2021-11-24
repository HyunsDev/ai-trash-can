const Gpio = require('pigpio').Gpio;
const AIData = require('./static/js/data')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}


// 모터 정보 로딩
const motorsInfo = {}
for (let model in AIData.model) {
  motorsInfo[model] = []
  for (let motor of AIData.model[model].motors) {
    motorsInfo[model].push(new Gpio(motor, {mode: Gpio.OUTPUT}))
  }
}

console.log(motorsInfo)

// 모터 테스트
;(async () => {
  for (let model in motorsInfo) {
    for (let motor of motorsInfo[model]) {
      motor.servoWrite(2500);
      await sleep(1000)
      motor.servoWrite(500);
      await sleep(1000)
    }
    await sleep(1000)
  }
})()