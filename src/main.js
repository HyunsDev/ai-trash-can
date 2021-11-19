const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
// const Gpio = require('pigpio').Gpio;



function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('../index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  ipcMain.on("main-test", (event, res) => {
    console.log(res); 
    event.sender.send('renderer-test', 'hello'); 
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// const motor = new Gpio(4, {mode: Gpio.OUTPUT});

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