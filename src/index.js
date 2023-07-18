require('dotenv').config()
const ngrok = require('ngrok');
const fastify = require('fastify')();
const fs = require('fs');
const { createLog } = require('../util/createLog.js');
const { pull } = require('../util/pull.js');
const { handleSignature } = require('../util/verifySignature.js');
const { checkEnv } = require('../util/checkEnv.js');
const PORT = +process.env.PORT || 3000;
const argv = require('minimist')(process.argv.slice(2));
let startTime = process.hrtime();

if (argv.devScript === "true") {
  (async function () {
    await ngrok.connect({
      addr: PORT, // port or network address, defaults to 80
      region: process.env.NGROK_REGION, // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
      onStatusChange: status => { createLog("NGROK STATUS", status.charAt(0).toUpperCase() + status.slice(1)) }, // 'closed' - connection is lost, 'connected' - reconnected
      onLogEvent: data => {
        if (data.includes("url")) {
          let url = data.split(" ")[data.split(" ").length - 1].slice(4)
          createLog("NGROK", `Ngrok is running on ${url}`)
        }
      },
    });
  })();
}

fs.readFile(process.env.DATA_PATH, 'utf8', (err, content) => {
  if (err) {
    checkEnv(err, false);
  }
  let config = JSON.parse(content);
  fastify.post('/webhook', async (request, reply) => {
    if (handleSignature(request) === false) {
      createLog('ERROR', 'Invalid signature');
      reply.code(401).send({ received: false, error: 'Invalid signature.' });
    }

    config.listen.forEach(async (repo) => {
      if (repo.git === request.body.repository.full_name) {
        const branchCheck = () => {
          if (request.body.ref.replace('refs/heads/', '') === repo.branch) {
            return { success: true, branch: request.body.ref.replace('refs/heads/', '') };
          } else {
            return false;
          }
        }

        if (request.body?.commits) {
          if (branchCheck().success === true) {
            createLog(repo.git + ' | WEBHOOK', 'Received push event to ' + branchCheck().branch + ' branch');
            await pull(repo.path, repo.git, repo.scripts);
          };
          reply.send({ received: true });
        }
      }
    });
  });

  checkEnv(config, true).then((output) => {
    if (output) {
      fastify.listen(
        {
          port: PORT,
          host: '0.0.0.0',
        },
        (err) => {
          if (err) {
            createLog('ERROR', err.message);
          } else {
            createLog('SERVER', `Server is running on port ${PORT}`);
            createLog('SERVER', `Server started in ${(process.hrtime(startTime)[0] * 1000 + process.hrtime(startTime)[1] / 1000000).toFixed(3)}ms`);
          }
        },
      );
    }
  })

})