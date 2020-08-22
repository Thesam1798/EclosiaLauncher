const {app, ipcMain} = require("electron");
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const logManager = require('./logManager')
const appManager = require('./appManager')
const updateManager = require('./updateManager')

module.exports = {

    load: function (win) {

        appManager.load(win)
        updateManager.load(win)

        ipcMain.on('isDebug', (event, arg) => {
            logManager.log("Event | isDebug : " + this.isDev(), __filename)
            win.webContents.send('isDebugReturn', this.isDev())
        })
    },

    isDev: function () {
        let fileContents = fs.readFileSync(path.join(app.getAppPath(), 'app', 'data', 'data.yaml'), 'utf8');
        let data = yaml.safeLoad(fileContents)
        return data.dev;
    }
};
