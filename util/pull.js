const execSync = require('child_process').execSync;

const pull = (path) => 
  {
    // import { execSync } from 'child_process';  // replace ^ if using ES modules
    let location = `git -C ${path} pull`
    const output = execSync(location, { encoding: 'utf-8' });  // the default is 'buffer'
    console.log('Output was:\n', output);
  }

module.exports = {pull}
