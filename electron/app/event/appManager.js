const {app, ipcMain} = require('electron')
const shell = require('electron').shell;
const logmanager = require('./logManager')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const updateManager = require(path.join('../', 'script', 'updateManager'))

module.exports = {

    load: function (win) {

        ipcMain.on('closeEvent', (event, arg) => {
            logmanager.log("Quit Launcher", __filename)
            updateManager.install()
            win.webContents.send('closeEventReturn', true)
            win.close()
            app.quit()
        })

        logmanager.log("closeEvent loaded", __filename)

        ipcMain.on('minEvent', (event, arg) => {
            logmanager.log("Minimize Launcher", __filename)
            win.minimize()
            win.webContents.send('minEventReturn', true)
        })

        logmanager.log("minEvent loaded", __filename)

        ipcMain.on('getData', (event, arg) => {
            logmanager.log("Demande des information du launcher", __filename)

            let fileContents = fs.readFileSync(path.join(app.getAppPath(), 'app', 'data', 'data.yaml'), 'utf8')
            let data = yaml.safeLoad(fileContents)
            win.webContents.send('getDataReturn', data)
        })

        logmanager.log("getData loaded", __filename)

        ipcMain.on('openLink', (event, arg) => {
            logmanager.log("Demande d'ouverture d'une url : " + arg, __filename)
            shell.openExternal(arg)
                .then(r => win.webContents.send('openLinkReturn', true))
                .catch(ex => {
                    logmanager.error(ex, __filename)
                    win.webContents.send('openLinkReturn', false)
                })
        })

        logmanager.log("openLink loaded", __filename)
    }
};
