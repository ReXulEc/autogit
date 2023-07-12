const fs = require('fs');
const { pull } = require('../util/pull.js');
const { createLog } = require('../util/createLog.js');
require('dotenv').config()
const fastify = require('fastify')();

fastify.post('/webhook', async (request, reply) => {
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
  //console.log('Received webhook payload:', payload);
  reply.send({ received: true });
});

/**.than((result) => {
      if (result.error === true) {
        createLog('ERROR', result.output);
      } else {
        createLog('SUCCESS', result.output);
      }
    }); */

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