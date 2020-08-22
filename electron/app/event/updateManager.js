const {app, ipcMain} = require('electron')
const os = require('os');
const {Octokit} = require("@octokit/core");
const logManager = require('./logManager')

const octokit = new Octokit({
    baseUrl: "https://api.github.com",
});

module.exports = {

    getLastVersion: async function (prerelease = false) {
        let versions = []
        let assets = []
        let retour = {
            version: '0.0.0',
            assets: [],
            upgrade: false,
            system: os.platform()
        }

        const request = await octokit.request('GET /repos/{owner}/{repo}/releases', {
            owner: 'Thesam1798',
            repo: 'EclosiaLauncher'
        }).catch((error) => {
            console.error("Error on git check")
            console.log(error)
        })

        for (let info in request.data) {
            if (request.data[info].draft === true) continue
            if (prerelease === false && request.data[info].prerelease === true) continue

            let version = request.data[info].name + ''
            let length = version.length + 1

            for (let i = version.length; i > 0; i--) {
                if (version.charAt(i) === '-') {
                    length = i
                    break
                }
            }

            version = version.substring(0, length)
            if (version.toLocaleLowerCase().charAt(0) !== 'v') continue

            version = version.substring(1, version.length + 1)

            versions.push(version);
            assets.push({
                version: version,
                assets: request.data[info].assets
            })
        }

        assets.forEach(value => {
            if (value.version === versions[0]) {
                retour.version = value.version
                retour.assets = value.assets
                retour.upgrade = (value.version.toLowerCase() !== app.getVersion().toLowerCase())
            }
        })

        return retour
    },

    load: function (win) {
        ipcMain.on('getLastVersion', (event, arg) => {
            logManager.log("Event | GetLastVersion, arg : " + arg, __filename)
            this.getLastVersion(arg.prerelease).then(r => {
                logManager.log("Event | GetLastVersion : " + r.version + " | curent : " + app.getVersion(), __filename)
                win.webContents.send('getLastVersionReturn', JSON.stringify(r))
            })
        })
    }
};
