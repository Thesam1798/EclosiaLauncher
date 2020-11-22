const {app, ipcMain} = require('electron')
const shell = require('electron').shell;
const path = require('path')
const logManager = require(path.join('../', 'script', 'logManager'))
const updateManager = require(path.join('../', 'script', 'updateManager'))
const javaManager = require(path.join('../', 'script', 'javaManager'))
const child_process = require("child_process");

module.exports = {
    load: function (win) {

        ipcMain.on('javaInstallEvent', () => {
            logManager.log("Start install java", __filename)
            try {
                javaManager.install(win).then(r => {
                    win.webContents.send('javaInstallEventReturn', r)
                }).catch(err => {
                    win.webContents.send('javaInstallEventError', err)
                })
            } catch (ex) {
                javaManager.install(win).then(r => {
                    win.webContents.send('javaInstallEventReturn', r)
                }).catch(err => {
                    win.webContents.send('javaInstallEventError', err)
                })
            }
        })

        logManager.log("javaInstallEvent loaded", __filename)

        ipcMain.on('closeEvent', () => {
            logManager.log("Quit Launcher", __filename)
            updateManager.install()
            win.webContents.send('closeEventReturn', true)
            win.close()
            app.quit()
        })

        logManager.log("closeEvent loaded", __filename)

        ipcMain.on('openDir', (event, args) => {
            logManager.log("Open Dir : " + args, __filename)
            open_file_exp(args)
            win.webContents.send('openDirReturn', true)
        })

        logManager.log("openDir loaded", __filename)

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

function open_file_exp(fpath) {
    let command;
    switch (process.platform) {
        case 'darwin':
            command = 'open -R ' + fpath;
            break;
        case 'win32':
            if (process.env.SystemRoot) {
                command = path.join(process.env.SystemRoot, 'explorer.exe');
            } else {
                command = 'explorer.exe';
            }
            command += ' /select,' + fpath;
            break;
        default:
            fpath = path.dirname(fpath)
            command = 'xdg-open ' + fpath;
    }
    child_process.exec(command, function (stdout) {
    });
}
