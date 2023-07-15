require('dotenv').config()
const ngrok = require('ngrok');
const fastify = require('fastify')();
const { createLog } = require('../util/createLog.js');
const { pull } = require('../util/pull.js');
const { handleSignature } = require('../util/verifySignature.js');
const { checkEnv } = require('../util/checkEnv.js');
const { runScript } = require('../util/runScript.js');
const PORT = +process.env.PORT || 3000;
const argv = require('minimist')(process.argv.slice(2));

if(argv.devScript === "true") {
  (async function() {
    await ngrok.connect({
      addr: PORT, // port or network address, defaults to 80
      region: process.env.NGROK_REGION, // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
      onStatusChange: status => {createLog("NGROK STATUS", status.charAt(0).toUpperCase() + status.slice(1))}, // 'closed' - connection is lost, 'connected' - reconnected
      onLogEvent: data => {
        if(data.includes("url")) {
          let url = data.split(" ")[data.split(" ").length -1].slice(4)
          createLog("NGROK", `Ngrok is running on ${url}`)
        }
      },
    });
  })();
}
checkEnv();

fastify.post('/webhook', async (request, reply) => {
    if (handleSignature(request, request.headers) === false) {
      createLog('ERROR', 'Invalid signature');
      reply.code(401).send({ received: false, error: 'Invalid signature.' });
    }

  const payload = request.body;
  const branchCheck = () => {
    if (payload.ref.replace('refs/heads/', '') === process.env.BRANCH) {
      return {success: true, branch: payload.ref.replace('refs/heads/', '')};
    } else {
      return false;
    }
  }

  if (payload?.commits) {
    if (branchCheck().success === true) {
      createLog('WEBHOOK', 'Received push event to ' + branchCheck().branch + ' branch');
        await pull(process.env.LOCAL_PATH)
    };
  reply.send({ received: true });
  }
});


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
    }
  },
);