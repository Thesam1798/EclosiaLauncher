const moment = require('moment')

module.exports = {

    prefix: function (scope = "unknown", type = "Log") {
        const time = moment().format('HH:mm:ss')
        const max = 75

        if (scope.length < (max - 2)) {
            const length = ((max - 2) - scope.length);

            for (let i = 0; i < length; i++) {
                scope = scope + " ";
            }
        }

        return " [" + time + "] [" + scope + "] [" + type + "] : "
    },

    log: function (data, scope = "unknown") {
        console.log(this.prefix(scope, "DEBUG") + data);
    },

    error: function (data, scope = "unknown") {
        const prefix = this.prefix(scope, "ERROR");
        const length = data.length + prefix.length;

        let separator = "";

        for (let i = 0; i < length; i++) {
            separator = separator + "-";
        }

        console.error(separator);
        console.error(prefix + data);
        console.error(separator);
    }
}
