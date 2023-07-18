const env = require('rapidenv')();
const crypto = require('crypto');
const { createLog } = require('./createLog.js');

const createSecret = () => {
    env.load();
    createLog('ERROR', 'WEBHOOK_SECRET is not valid.', true);
    env.setVariable("WEBHOOK_SECRET", crypto.randomBytes(64).toString('hex'));
    createLog('INFO', 'New WEBHOOK_SECRET created. You can find it in .env file.', true);
};

module.exports = {createSecret};