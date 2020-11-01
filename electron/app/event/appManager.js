const {app, ipcMain} = require('electron')
const shell = require('electron').shell;
const path = require('path')
const logManager = require(path.join('../', 'script', 'logManager'))
const updateManager = require(path.join('../', 'script', 'updateManager'))

module.exports = {

    load: function (win) {

        ipcMain.on('closeEvent', () => {
            logManager.log("Quit Launcher", __filename)
            updateManager.install()
            win.webContents.send('closeEventReturn', true)
            win.close()
            app.quit()
        })

        logManager.log("closeEvent loaded", __filename)

        ipcMain.on('minEvent', () => {
            logManager.log("Minimize Launcher", __filename)
            win.minimize()
            win.webContents.send('minEventReturn', true)
        })

        logManager.log("minEvent loaded", __filename)

        ipcMain.on('openLink', (event, arg) => {
            logManager.log("Demande d'ouverture d'une url : " + arg, __filename)
            shell.openExternal(arg)
                .then(win.webContents.send('openLinkReturn', true))
                .catch(ex => {
                    logManager.error(ex, __filename)
                    win.webContents.send('openLinkReturn', false)
                })
        })

        ipcMain.on('toggleDevTools', () => {
            let devToolsOpened = win.webContents.isDevToolsOpened();

            if (devToolsOpened) {
                win.webContents.closeDevTools()
                logManager.log("Demande de fermeture de la console", __filename)
            } else {
                win.webContents.openDevTools()
                logManager.log("Demande d'ouverture de la console", __filename)
            }

            win.webContents.send('toggleDevToolsReturn', !devToolsOpened)
        })

        logManager.log("openLink loaded", __filename)
    }
};
