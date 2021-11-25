const Gpio = require('pigpio').Gpio;
const fs = require("fs")
const motorList = require('./data/motor.json')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 모터 클래스
class Motor {
  constructor (gpio) {
    this.motors = gpio.map(e => {
      new Gpio(e, {mode: Gpio.OUTPUT})
    })
    this.isOpen = false
  }

  open(force=false) {
    if (!this.isOpen || force) {
      this.motors.forEach(e => {
        e.servoWrite(motorList.config['open-angle']);
      });
      return true
    } else {
      return false
    }
  }

  close(force=false) {
    if (this.isOpen || force) {
      this.motors.forEach(e => {
        e.servoWrite(motorList.config['close-angle']);
      });
      return true
    } else {
      return false
    }
  }

}


// 모터 로딩
const motorInfo = {}
for (let model in motorList) {
  const motor = new Motor(gpio)
  motorInfo[model] = motor

  // 모터 테스트
  motor.open()
  sleep(500)
  motor.close()
  sleep(500)
}

// 실행
;(async () => {
  while (true) {
    try {
      const jsonFile = fs.readFileSync('data.txt', 'utf8');
      const jsonData = JSON.parse(jsonFile);

      if (jsonData.status == "found") {
        console.log(`${jsonData.kind}을 발견하였습니다.`)
        for (let kind in motorList) {
          if (kind == jsonData.kind) { motorInfo[kind].open() }
          else { motorInfo[kind].close() }
        }
      } else {
        for (let kind in motorList) {
          motorInfo[kind].close()
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
})



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