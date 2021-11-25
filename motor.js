const Gpio = require('pigpio').Gpio;
const fs = require("fs")
const motorList = require('./data/motor.json')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 모터 클래스
class Motor {
  constructor (gpio, name) {
    this.name = name
    this.motors = gpio.map(e => {
      console.log(`${e} GPIO added to ${name} Group`)
      return new Gpio(e, {mode: Gpio.OUTPUT})
    })
    this.isOpen = false
  }

  open(force=false) {
    if (!this.isOpen || force) {
      console.log(`Open ${this.name}`)
      this.isOpen = true
      this.motors.forEach(e => {
        e.servoWrite(motorList.config['open-angle']);
        e.servoWrite(100);
      });
      
      return true
    } else {
      return false
    }
  }

  close(force=false) {
    if (this.isOpen || force) {
      console.log(`Close ${this.name}`)
      this.isOpen = false
      this.motors.forEach(e => {
        e.servoWrite(motorList.config['close-angle']);
        e.servoWrite(100);
      });
      return true
    } else {
      return false
    }
  }

}


// 모터 로딩
const motorInfo = {}
for (let model in motorList.motors) {
  const motor = new Motor(motorList.motors[model].motors, model)
  motorInfo[model] = motor

  // 모터 테스트
  ;(async () => {
    console.log(`${model} TEST - Open`)
    motor.open()
    await sleep(2000)
    console.log(`${model} TEST - Close`)
    motor.close()
    await sleep(2000)
  })()
}

let beforeStatus

// 실행
;(async () => {
  while (true) {
    try {
      const jsonFile = fs.readFileSync('data.txt', 'utf8');
      const jsonData = JSON.parse(jsonFile);

      if (jsonData.status == "found") {
        console.log(`${jsonData.kind} Found!`)
        for (let kind in motorList.motors) {
          if (kind == jsonData.kind) { motorInfo[kind].open() }
          else { motorInfo[kind].close() }
        }
      } else {
        console.log(`scanning`)
        for (let kind in motorList.motors) {
          motorInfo[kind].close()
        }
      }
    } catch (err) {
      console.error(err)
    }
    await sleep(1000)
  }
})()



// ;(async () => {
//     while (true) {
//         const jsonFile = fs.readFileSync('data.txt', 'utf8');
//         let jsonData
//         try {
//           jsonData = JSON.parse(jsonFile);
//         } catch (err) {

//         }
        
        
//         if (jsonData.status == "found") {
//             console.log(jsonData.kind)
//             for (let kind in motorList) {
//                 for (let motor of motorInfo[kind]) {
//                   if (kind == jsonData.kind) {
//                     motor.servoWrite(2400);
//                   } else {
//                     motor.servoWrite(600);
//                   }
//               }
//             }
//         } else {
//           motor.servoWrite(600);
//         }
//         await sleep(200)
//     }
// })()