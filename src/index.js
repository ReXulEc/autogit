const fs = require('fs');
const os = require('node:os');
const { Octokit } = require('@octokit/rest');
const pull = require('../modules/pull.js');
const consola = require('consola')
require('dotenv').config()
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
  userAgent: `AutoGit 1.0.0 on ${os.platform()}`,
  timeZone: 'Istanbul/Turkey',
});


let configsheme = {
  "lastestsha": ""
}

consola.info("AutoGit 1.0.0 Started...");

if(process.env.INTERVAL<5000){
  consola.error("We don't recommend to use less than 5 seconds interval (Ratelimit - 1000req/hour). Please change it in .env file. If you are using an ENTERPRICE ACCOUNT ON GITHUB, you can comment this 3 line.");
  process.exit(1);
}

function main() {
  var start = new Date().getTime();
  octokit.repos.listCommits({
    owner: process.env.GH_OWNER,
    repo: process.env.GH_REPO,
    per_page: 1
  })
    .then(({ data, headers, status }) => {
      configsheme.lastestsha = data[0].sha;

      fs.readFile('./src/config.json', 'utf8', (err, data) => {
        if (err) {
          
          return consola.error(new Error(err));
          process.exit(1);

        }

        try {
          const client = JSON.parse(data);
          if (client.lastestsha == "") {
            consola.info("The Config file is prepairing itself for first run...");
            fs.writeFile('./src/config.json', JSON.stringify(configsheme), (err) => {
              if (err) {
                return consola.error(new Error(err));
                process.exit(1);
              }
            }
            )
            var elapsed = new Date().getTime() - start;
            consola.success("Done in " + elapsed + "ms.")
          }

          if (client.lastestsha == configsheme.lastestsha) {
            return;
          } else {
            consola.info(`Pulling the latest changes...`);
            pull(process.env.LOCAL_PATH);
            fs.writeFile('./src/config.json', JSON.stringify(configsheme), (err) => {
              if (err) {
                console.log("File can't be written", err);
                return;
              }
            }
            )
            consola.info(`${configsheme.lastestsha} is the latest commit.`);
          }
        } catch (err) {
          console.log("Error parsing JSON string:", err);
        }
      });
    })
}

setInterval(main, process.env.INTERVAL);