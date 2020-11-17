const {ipcMain} = require("electron");
const {autoUpdater} = require('electron-updater')
const isDev = require('electron-is-dev');

const semver = require('semver')
const path = require('path')

const logManager = require(path.join('../', 'script', 'logManager'))
const appManager = require('./appManager')

module.exports = {

    load: function (win) {

        appManager.load(win)

        ipcMain.on('getAppName', (event, arg) => {
            let productName = (require(path.join(__dirname, '../..', 'package.json')).productName).split('-')[0];
            logManager.log("Event | getAppName : " + productName, __filename)
            win.webContents.send('getAppNameReturn', productName)
        })

        autoUpdater.checkForUpdates().then(r => {

            let last = r.updateInfo.releaseName
            const curent = autoUpdater.currentVersion.version
            let fullDate = r.updateInfo.releaseDate

            fullDate = fullDate.replace('T', ' ')
            fullDate = fullDate.replace('Z', ' ')
            fullDate = fullDate.split('.')[0]

            let date = fullDate.split(' ')[0]
            let time = fullDate.split(' ')[1]

            date = date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0]

            fullDate = date + ' ' + time

            let past = semver.lt(last, curent)

            if (past) {
                if (!isDev) {
                    last = "V" + curent + " | DEV PROD ??"
                } else {
                    last = "DEV";
                }
                fullDate = "00-00-00 00:00:00"
            }

            ipcMain.on('getLastVersion', (event, arg) => {
                logManager.log("Event | getLastVersion : " + last, __filename)
                win.webContents.send('getLastVersionReturn', last)
            })

            ipcMain.on('getBuildDate', (event, arg) => {
                logManager.log("Event | getBuildDate : " + fullDate, __filename)
                win.webContents.send('getBuildDateReturn', fullDate)
            })
        })

        logManager.log("All event loaded", __filename)
    }
};
