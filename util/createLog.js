const { cyan, yellow } = require('colorette');

const createLog = (title, message) => 
{
    console.log(`[ ${cyan(title)} ] --> ${yellow(message)}`);
};

module.exports = {createLog};