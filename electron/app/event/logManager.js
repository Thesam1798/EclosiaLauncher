const moment = require('moment')
const fs = require('fs');
const path = require('path')
const folder = path.join(process.env.LOCALAPPDATA, require(path.join(__dirname, '../..', 'package.json')).productName)

print("------------------------------------------------------------------------------------------------------------------------------------------------------", false)

module.exports = {

    prefix: function (scope = "unknown", type = "Log") {
        const time = moment().format('HH:mm:ss')
        const max = 75

        if (scope.length < (max - 2)) {
            const length = ((max - 2) - scope.length);

            for (let i = 0; i < length; i++) {
                scope = scope + " "
            }
        }

        return "[" + time + "] [" + scope + "] [" + type + "] : "
    },

    log: function (data, scope = "unknown") {
        print(this.prefix(scope, "DEBUG") + data, false)
    },

    error: function (data, scope = "unknown") {
        const prefix = this.prefix(scope, "ERROR")
        const length = data.length + prefix.length

        let separator = ""

        for (let i = 0; i < length; i++) {
            separator = separator + "-"
        }

        print(separator, true)
        print(prefix + data, true)
        print(separator, true)
    }
}

function print(string, error) {

    try {

        if (!fs.existsSync(path.join(folder))) {
            fs.mkdirSync(path.join(folder))
        }

        if (!fs.existsSync(path.join(folder, 'logs'))) {
            fs.mkdirSync(path.join(folder, 'logs'))
        }

        fs.appendFile(path.join(folder, 'logs', moment().format('D_M_YYYY') + '.txt'), string + '\n', function (err) {
            if (err) console.log(err)
        });
    } catch (e) {
        console.error(e)
    }

    if (error) {
        console.error(string)
    } else {
        console.log(string)
    }
}
