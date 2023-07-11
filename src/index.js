const fs = require('fs');
const pull = require('../util/pull.js');
const {createLog} = require('../util/createLog.js');
require('dotenv').config()
const fastify = require('fastify')();

fastify.post('/webhook', async (request, reply) => {
  const payload = request.body;
  if (payload.ref === 'refs/heads/master') {
    createLog('WEBHOOK', 'Received push event to master branch');
    pull(process.env.LOCAL_PATH);
  }
  console.log('Received webhook payload:', payload);
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