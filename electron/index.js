const {app, BrowserWindow, dialog} = require('electron')
const isDev = require('electron-is-dev');
const path = require('path')

try {
    const eventManager = require(path.join(app.getAppPath(), 'app', 'event', 'eventManager'))
    const logManager = require(path.join(app.getAppPath(), 'app', 'script', 'logManager'))
    const updateManager = require(path.join(app.getAppPath(), 'app', 'script', 'updateManager'))

    let win;

    updateManager.allowPrerelease(true);
    updateManager.allowDowngrade(false);
    updateManager.checkUpdate();

    function createWindow() {

        // Create the browser window.
        win = new BrowserWindow({
            width: 980 * 1.5,
            height: 552 * 1.5,
            minWidth: 980,
            minHeight: 552,
            maxWidth: 980 * 1.5,
            maxHeight: 552 * 1.5,
            icon: path.join(app.getAppPath(), 'src', 'assets', 'logo.png'),
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

        eventManager.load(win)
        win.removeMenu()

        win.loadURL(`file://${app.getAppPath()}/src/index.html`).then(() => {
            logManager.log("Fichier index load !", __filename)
            if (isDev) {
                win.webContents.openDevTools()
            }
        }).catch(ex => {
            logManager.error(ex, __filename)
        })

        win.once('ready-to-show', () => {
            win.show()
        })

        // Event when the window is closed.
        win.on('closed', function () {
            win = null
        })
    }

    app.on('ready', createWindow)

    app.on('activate', function () {
        // macOS specific close process
        if (win === null) {
            createWindow()
        }
    })

} catch (ex) {
    app.on('ready', () => {
        let options = {}
        options.type = "error"
        options.buttons = ["&Close"]
        options.title = "Une erreur est survenue !"
        options.message = "Une erreur est survenue, fermeture de l'application.\n\n" + ex.toString()
        options.normalizeAccessKeys = true

        console.error(ex)

        dialog.showMessageBox(options).finally(() => {
            app.quit()
        })
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
