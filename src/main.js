const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const PiServo = require('pi-servo');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
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

;(async () => {
  const sv1 = new PiServo(4); 
  let a = true
  await sv1.open()

  setInterval(() => {
    sv1.setDegree(a ? 180 : 0);
    a = !a
  }, 1000)
})()
