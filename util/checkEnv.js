require('dotenv').config()
const fs = require('fs');
const { createSecret } = require('./createSecret.js');
const { createLog } = require('./createLog.js');
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
        ifval: undefined,
        ifcondition: false,
        run: function () {
            createLog('ERROR', 'Branch is not valid. You need to change in the .env.', true)
            error = true;
        }
    },
    LOCAL_PATH: {
        ifval: undefined,
        ifcondition: false,
        run: function () {
            createLog('ERROR', 'Local Path is not valid. You need to change in the .env.', true)
            error = true;
        }
    },
    DATA_FILE: {
        ifval: undefined,
        ifcondition: false,
        run: function () {
            createLog('ERROR', 'Data file or configuration is not valid.', true)
            error = true;
        }
    },
}

const checkEnv = (dataJson, success) => {
    if (!success) {
        createLog('ERROR', 'Error while reading data file.', true)
        error = true;
    }
    for (const repo of dataJson.listen) {
        if (repo.branch) {
            if (envvalues.BRANCH.ifval !== false) envvalues.BRANCH.ifval = true;
        } else envvalues.BRANCH.ifval = false;

        if (repo.path.length > 0 && repo.path.includes('\\')) {
            if (envvalues.LOCAL_PATH.ifval !== false) envvalues.LOCAL_PATH.ifval = true;
        } else envvalues.LOCAL_PATH.ifval = false;


        if (dataJson.listen.length > 0 && success === true && Object.keys(repo).length === 4) {
            if (envvalues.DATA_FILE.ifval !== false) envvalues.DATA_FILE.ifval = true;
        } else envvalues.DATA_FILE.ifval = false;

    }
    for (const [key, value] of Object.entries(envvalues)) {
        if (value.ifval === value.ifcondition) {
            value.run();
        }
    }
    if (error) {
        process.exit(1);
    } else {
        return Promise.resolve(true);
    }
}

module.exports = { checkEnv };