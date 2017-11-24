/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const fastify = require('fastify')();

fastify.register(require('./app/ha-bridge'));
fastify.register(require('./app/routes'));

// Run the server!
fastify.listen(3000, function (err) {
  if (err) throw err;
  fastify.log.info(`server listening on ${fastify.server.address().port}`);
});