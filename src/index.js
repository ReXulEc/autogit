require('dotenv').config()
const fastify = require('fastify')();
const { createLog } = require('../util/createLog.js');
const { pull } = require('../util/pull.js');
const { handleSignature } = require('../util/verifySignature.js');
const { createSecret } = require('../util/createSecret.js');
const { checkEnv } = require('../util/checkEnv.js');

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
      pull(process.env.LOCAL_PATH)
    }
  };
  reply.send({ received: true });
});

const PORT = +process.env.PORT || 3000;

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