const {autoUpdater} = require('electron-updater')

const semver = require('semver')
const logManager = require('./logManager')

let update = false

autoUpdater.logger = null
autoUpdater.allowPrerelease = true
autoUpdater.allowDowngrade = true
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

autoUpdater.on('checking-for-update', () => {
    logManager.log('Checking for update...', __filename)
})

autoUpdater.on('update-available', (info) => {
    logManager.log('Update available', __filename)
    logManager.log('Version : ' + info.version, __filename)
    logManager.log('Release date : ' + info.releaseDate, __filename)
})

autoUpdater.on('update-not-available', () => {
    logManager.log('Update not available', __filename)
    logManager.log('Version : ' + autoUpdater.currentVersion.version, __filename)
})

autoUpdater.on('download-progress', (progress) => {
    logManager.log('Progress ' + Math.floor(progress.percent) + '%', __filename)
})

autoUpdater.on('update-downloaded', () => {
    logManager.log('Update downloaded', __filename)
})

autoUpdater.on('error', (error) => {
    logManager.error(error, __filename)
})

module.exports = {

    checkUpdate: function () {
        autoUpdater.checkForUpdates().then(r => {

            const last = r.updateInfo.version
            const curent = autoUpdater.currentVersion.version

            if (semver.gt(last, curent)) {
                let diff = semver.diff(last, curent);
                logManager.log('Type de difference : ' + diff, __filename)

                if (diff === 'major') {
                    logManager.log('Auto close on download end', __filename)
                    autoUpdater.downloadUpdate(r.cancellationToken).then(() => {
                        this.install()
                        update = true;
                    }).catch(error => {
                        logManager.error(error.toString(), __filename)
                    })
                } else {
                    logManager.log('Auto install on launcher closed', __filename)
                    autoUpdater.downloadUpdate(r.cancellationToken).then(() => {
                        autoUpdater.autoInstallOnAppQuit = true
                        update = true;
                    }).catch(error => {
                        logManager.error(error.toString(), __filename)
                    })
                }
            }
        })
    },

    allowPrerelease: function (bool) {
        autoUpdater.allowPrerelease = bool
    },

    allowDowngrade: function (bool) {
        autoUpdater.allowDowngrade = bool
    },

    install: function () {
        if (update) {
            autoUpdater.quitAndInstall(false, true)
        }
    }

}
