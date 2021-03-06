const builder = require('electron-builder')
const Platform = builder.Platform

function getCurrentPlatform() {
    switch (process.platform) {
        case 'win32':
            return Platform.WINDOWS
        case 'darwin':
            return Platform.MAC
        case 'linux':
            return Platform.linux
        default:
            console.error('Cannot resolve current platform!')
            return undefined
    }
}

builder.build({
    targets: (process.argv[2] != null && Platform[process.argv[2]] != null ? Platform[process.argv[2]] : getCurrentPlatform()).createTarget(),
    config: {
        appId: 'eclosialauncher',
        productName: 'Eclosia-Launcher',
        artifactName: 'Eclosia-Launcher-setup-${version}.${ext}',
        copyright: 'Copyright © 2018-2020 Alexandre Debris',
        directories: {
            buildResources: 'build',
            output: 'output'
        },
        files: [
            'src/**/*',
            'app/**/*',
            'index.js'
        ],
        compression: 'maximum',
        asar: true,
        remoteBuild: false,
        win: {
            target: [
                {
                    target: 'nsis',
                    arch: 'x64'
                }
            ],
        },
        nsis: {
            oneClick: false,
            perMachine: false,
            allowElevation: true,
            allowToChangeInstallationDirectory: true
        },
        mac: {
            target: 'dmg',
            category: 'public.app-category.games'
        },
        linux: {
            target: 'AppImage',
            maintainer: 'Alexandre Debris',
            vendor: 'Alexandre Debris',
            synopsis: 'Modded Minecraft Launcher',
            description: 'Custom launcher which allows users to join modded servers. All mods, configurations, and updates are handled automatically.',
            category: 'Game'
        }
    }
}).then(() => {
    console.log('Build complete!')
}).catch(err => {
    console.error('Error during build!', err)
})
