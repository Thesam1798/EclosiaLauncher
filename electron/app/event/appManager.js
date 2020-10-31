const {app, ipcMain} = require('electron')
const shell = require('electron').shell;
const path = require('path')
const logManager = require(path.join('../', 'script', 'logManager'))
const updateManager = require(path.join('../', 'script', 'updateManager'))

module.exports = {

    load: function (win) {

        ipcMain.on('closeEvent', (event, arg) => {
            logManager.log("Quit Launcher", __filename)
            updateManager.install()
            win.webContents.send('closeEventReturn', true)
            win.close()
            app.quit()
        })

        logManager.log("closeEvent loaded", __filename)

        ipcMain.on('minEvent', (event, arg) => {
            logManager.log("Minimize Launcher", __filename)
            win.minimize()
            win.webContents.send('minEventReturn', true)
        })

        logManager.log("minEvent loaded", __filename)

        ipcMain.on('openLink', (event, arg) => {
            logManager.log("Demande d'ouverture d'une url : " + arg, __filename)
            shell.openExternal(arg)
                .then(r => win.webContents.send('openLinkReturn', true))
                .catch(ex => {
                    logManager.error(ex, __filename)
                    win.webContents.send('openLinkReturn', false)
                })
        })

        logManager.log("openLink loaded", __filename)
    }
};
