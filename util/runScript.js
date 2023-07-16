const { exec } = require('child_process');
const { promisify } = require('util');
const { createLog } = require('./createLog.js');
require('dotenv').config()
const fs = require('fs');

  function runScript() {
    fs.readFile(process.env.DATA_PATH, 'utf8', (err, content) => {
        if (err) {
          createLog('ERROR FROM DATA FILE', err, true);
          return;
        }
        const jsonData = JSON.parse(content);
        if (jsonData.length > 0) {
          runCommands(jsonData);
        } else {
            return;
        }
      });    
  }

async function runCommands(commands) {
  for (const command of commands) {
    createLog("SCRIPT", `Running "${command}"`);

    const execPromise = promisify(exec);
    try {
      const { stdout, stderr } = await execPromise(command);
      createLog("SCRIPT", `Output:\n${stdout}`);
    } catch (error) {
      createLog("SCRIPT ERROR", `${error.message}`, true);
    }
  }
}

module.exports = {runScript}