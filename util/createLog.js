const { cyan, yellow, bgRed } = require('colorette');

const createLog = (title, message, error) => 
{
    const errorText = error ? bgRed(`[ ${title} ]`) : `[ ${cyan(title)} ]`;
    console.log(`${errorText} --> ${yellow(message)}`);
};

module.exports = {createLog};