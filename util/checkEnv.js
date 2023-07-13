require('dotenv').config()
const {createSecret} = require('./createSecret.js');
const {createLog} = require('./createLog.js');
let error = false;

const envvalues = {
    WEBHOOK_SECRET: {
        ifval: process.env.WEBHOOK_SECRET.length == 128,
        ifcondition: false,
        run: function () {
            createSecret();
        }
    },
    BRANCH: {
        ifval: process.env.BRANCH.length > 0,
        ifcondition: false,
        run: function () {
            createLog('ERROR', 'Branch is not valid. You need to change in the .env.', true)
            error = true;
        }
    },
    LOCAL_PATH: {
        ifval: process.env.LOCAL_PATH.length > 0 && process.env.LOCAL_PATH.includes('\\'),
        ifcondition: false,
        run: function () {
            createLog('ERROR', 'Local Path is not valid. You need to change in the .env.', true)
            error = true;
        }
    },
}

const checkEnv = () => {
    for (const [key, value] of Object.entries(envvalues)) {
        if(value.ifval === value.ifcondition) {
            value.run();
        }
    }
    if(error === true) {
        process.exit(1);
    }
}

module.exports = { checkEnv };