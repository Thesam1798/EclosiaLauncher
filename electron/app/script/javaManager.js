const {app} = require('electron')
const fs = require('fs-extra')
const path = require('path')
const request = require('request')
const isDev = require('electron-is-dev')
const progress = require('request-progress')
const inly = require('inly');
const logManager = require('./logManager')

let app_folder
if (isDev) {
    //Curent dir in dev
    app_folder = path.join(app.getAppPath())
} else {
    //Output compiled dir
    app_folder = path.join(app.getAppPath(), "..", "..")
}

const download_dir = path.join(app_folder, 'download')

function get_info(win, major) {

    let sanitizedOS, ext

    switch (process.platform) {
        case 'win32':
            sanitizedOS = 'windows'
            ext = 'zip'
            break
        case 'darwin':
            sanitizedOS = 'macos'
            ext = 'tar.gz'
            break
        case 'linux':
            sanitizedOS = 'linux'
            ext = 'tar.gz'
            break
        default:
            sanitizedOS = process.platform
            ext = 'tar.gz'
            break
    }

    const url = `https://corretto.aws/downloads/latest/amazon-corretto-${major}-x64-${sanitizedOS}-jdk.${ext}`

    return new Promise((resolve) => {
        request.head({url, json: true}, (err, resp) => {
            if (!err && resp.statusCode === 200) {
                resolve({
                    uri: url,
                    size: parseInt(resp.headers['content-length']),
                    name: url.substr(url.lastIndexOf('/') + 1)
                })
            } else {
                resolve(null)
            }
        })
    })
}

function unzip(win, download_file) {
    return new Promise((resolve, reject) => {
        fs.stat(download_file, function (err) {
            if (err == null) {
                const temp_dir = path.join(app_folder, 'temp');
                const java_dir = path.join(app_folder, 'java');
                const extract = inly(download_file, temp_dir);

                extract.on('progress', (percent) => {
                    logManager.log('Unzip : ' + percent + '%', __filename)
                    win.webContents.send('javaInstallEventUnzip', (percent - 0.5))
                });

                extract.on('error', (error) => {
                    reject(error)
                });

                extract.on('end', () => {
                    const folder_in_temp = fs.readdirSync(temp_dir).map(name => path.join(temp_dir, name))

                    if (fs.existsSync(java_dir)) {
                        logManager.log('Remove old : ' + java_dir, __filename)
                        fs.removeSync(java_dir)
                    }

                    setTimeout(() => {
                        if (folder_in_temp.length === 1) {
                            fs.moveSync(folder_in_temp[0], java_dir)
                        }

                        if (fs.existsSync(folder_in_temp)) {
                            fs.removeSync(folder_in_temp)
                            logManager.log('Remove old : ' + folder_in_temp, __filename)
                        }

                        if (fs.existsSync(temp_dir)) {
                            fs.removeSync(temp_dir)
                            logManager.log('Remove old : ' + temp_dir, __filename)
                        }

                        if (fs.existsSync(download_file)) {
                            fs.removeSync(download_file)
                            logManager.log('Remove old : ' + download_file, __filename)
                        }

                        win.webContents.send('javaInstallEventUnzip', 100)
                        resolve(java_dir)
                    }, 2000)
                });
            } else {
                reject('File Download not exist !')
            }
        });
    })
}

function download(win, java_info) {
    fs.removeSync(download_dir)
    fs.mkdirSync(download_dir)

    const download_file = path.join(download_dir, java_info.name)
    const output = fs.createWriteStream(download_file)

    return new Promise((resolve, reject) => {
        progress(request(java_info.uri))
            .on('end', function () {
                win.webContents.send('javaInstallEventDownload', 100)
                resolve(download_file)
            })
            .on('progress', function (state) {
                logManager.log('Download : ' + (state.percent * 100) + '%', __filename)
                win.webContents.send('javaInstallEventDownload', (state.percent * 100))
            })
            .on('error', function (err) {
                reject(err)
            })
            .pipe(output);
    })
}

function install(win) {
    return new Promise((resolve, reject) => {
        get_info(win, '8').then(info => {

            let ext = ''

            if (process.platform === 'win32') {
                ext = '.exe'
            }

            const java = path.join(app_folder, 'java')
            const bin = path.join(java, 'bin', 'java' + ext)

            if (fs.existsSync(java) && fs.existsSync(bin)) {
                logManager.info('JAVA folder : ' + java, __filename)
                resolve(java)
            } else {
                download(win, info).then(function (file) {
                    unzip(win, file).then(() => {

                        if (fs.existsSync(download_dir)) {
                            fs.remove(download_dir).then(() => {
                                logManager.log('Remove old : ' + download_dir, __filename)
                            })
                        }

                        logManager.info('JAVA folder : ' + java, __filename)
                        resolve(java)

                    }).catch(() => {
                        logManager.error('Error on unzip !', __filename)
                        reject('Error on unzip !')
                    })
                }).catch(() => {
                    logManager.error('Error on download !', __filename)
                    reject('Error on download !')
                })
            }
        }).catch(() => {
            logManager.error('Not info from Amazon !', __filename)
            reject('Not info from Amazon !')
        })
    })
}

module.exports = {

    install: function (win) {
        return install(win)
    }
}
