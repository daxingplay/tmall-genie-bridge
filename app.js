/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const path = require('path');
const fastify = require('fastify')({
  logger: !!process.env.DEBUG,
});
const helmet = require('fastify-helmet');

fastify.register(helmet);
fastify.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs'),
  },
  templates: path.resolve(__dirname, './app/view'),
});
fastify.register(require('fastify-formbody'));
fastify.register(require('./app/ha-bridge'), {
  haPassword: process.env.HA_PASSWORD,
  haUrl: process.env.HA_URL,
});
fastify.register(require('./app/oauth'));
fastify.register(require('./app/routes'), {
  serverPassword: process.env.PASSWORD,
});

// Run the server!
fastify.listen(3000, function (err) {
  if (err) {
    throw err;
  }
  fastify.log.info(`server listening on ${fastify.server.address().port}`);
});