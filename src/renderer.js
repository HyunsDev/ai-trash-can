const { ipcRenderer } = require('electron')

ipcRenderer.send('main-test', "123");
