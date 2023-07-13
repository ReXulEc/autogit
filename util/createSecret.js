const env = require('rapidenv')();
const crypto = require('crypto');

env.load();
var token = crypto.randomBytes(64).toString('hex');
env.setVariable("WEBHOOK_SECRET", token);