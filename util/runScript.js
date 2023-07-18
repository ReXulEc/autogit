const { exec } = require('child_process');
const { promisify } = require('util');
const { createLog } = require('./createLog.js');
require('dotenv').config()
const fs = require('fs');

async function runScript(commands, git) {
  for (const command of commands) {
    createLog(git + " | SCRIPT", `Running "${command}"`);

    const execPromise = promisify(exec);
    try {
      const { stdout, stderr } = await execPromise(command);
      createLog(git + " | SCRIPT", `Output:\n${stdout}`);
    } catch (error) {
      createLog(git + " | SCRIPT ERROR", `${error.message}`, true);
    }
  }
}

module.exports = {runScript}