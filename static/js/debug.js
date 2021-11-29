let isDebugMode = false
function debug() {
    if (isDebugMode) {
        document.getElementById("debug").style.opacity = 0
        isDebugMode = false
    } else {
        document.getElementById("debug").style.opacity = 1
        isDebugMode = true
    }
    
}

function debug_reset() {
    console.log("Reset")
    window.location.reload(true)
}

function debug_exit() {
    ipcRenderer.send('exit', "exit");
}