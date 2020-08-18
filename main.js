const {app, BrowserWindow} = require('electron')
const path = require('path')

const eventmanager = require(path.join(app.getAppPath(), 'electron', 'eventManager'))
const logManager = require(path.join(app.getAppPath(), 'electron', 'logManager'))

let win;

function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 980,
    height: 552,
    minWidth: 980,
    minHeight: 552,
    icon: path.join(app.getAppPath(), 'dist', 'assets', 'logo.png'),
    show: false,
    center: true,
    transparent: true,
    frame: false,
    resizable: true,
    backgroundColor: '#171614',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: false
    }
  })

  eventmanager.load(win)
  win.removeMenu()

  if (eventmanager.isDev()) {
    win.loadURL(`http://localhost:4200`).then(() => {
      logManager.log("DEV LOCALHOST", __filename)
      win.webContents.openDevTools()
    }).catch(ex => {
      logManager.error(ex, __filename)
    })
  } else {
    win.loadURL(`file://${app.getAppPath()}/dist/index.html`).then(() => {
      logManager.log("Fichier index load !", __filename)
    }).catch(ex => {
      logManager.error(ex, __filename)
    })
  }


  win.once('ready-to-show', () => {
    win.show()
  })

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})
