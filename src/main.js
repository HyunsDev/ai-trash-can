const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const AIData = require('../static/js/data')
const Gpio = require('pigpio').Gpio;


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
for (let model in motorsInfo) {
  for (let motor of motorsInfo[model]) {
    motor.servoWrite(2500);
    await sleep(1000)
    motor.servoWrite(500);
    await sleep(1000)
  }
  await sleep(1000)
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    // fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  mainWindow.loadFile('../index.html')
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  ipcMain.on("trash", (event, res) => {
    console.log(res)
    // event.sender.send('renderer-test', 'hello'); 
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})



// 

// let pulseWidth = 1000;
// let increment = 100;

// setInterval(() => {
//   motor.servoWrite(pulseWidth);

//   pulseWidth += increment;
//   if (pulseWidth >= 2000) {
//     increment = -100;
//   } else if (pulseWidth <= 1000) {
//     increment = 100;
//   }
// }, 1000);