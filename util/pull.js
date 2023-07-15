const execSync = require('child_process').execSync;
const { exec, spawn } = require('node:child_process');
const { createLog } = require('./createLog.js');
const { runScript } = require('./runScript.js');


const pull = (path) => 
  {
    // import { execSync } from 'child_process';  // replace ^ if using ES modules
    let location = `git -C ${path} pull`
    //execSync(location, { encoding: 'utf-8' }) 
    exec(location, (err, stdout, stderr) => {
      if (stderr.includes('error:')) {
        createLog('ERROR', "Error while pulling from git\n\n" + stderr, true);
      } else {
        createLog('SUCCESS', stdout);
        runScript();

      }
    });
  }

module.exports = {pull}
