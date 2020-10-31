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
            logManager.log("Event | getAppName : " + (require(path.join(__dirname, '../..', 'package.json')).productName).split('-')[0], __filename)
            win.webContents.send('getAppNameReturn', (require(path.join(__dirname, '../..', 'package.json')).productName).split('-')[0])
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

            setTimeout(function () {
                ipcMain.on('getLastVersion', (event, arg) => {
                    logManager.log("Event | getLastVersion : " + last, __filename)
                    win.webContents.send('getLastVersionReturn', last)
                })

                ipcMain.on('getBuildDate', (event, arg) => {
                    logManager.log("Event | getBuildDate : " + fullDate, __filename)
                    win.webContents.send('getBuildDateReturn', fullDate)
                })
            }, 3000);
        })

        logManager.log("All event loaded", __filename)
    }
};
