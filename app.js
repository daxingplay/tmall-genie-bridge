/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const path = require('path');
const fastify = require('fastify')({
  logger: !!process.env.DEBUG,
});
const helmet = require('fastify-helmet');
const config = require('./config');

fastify.register(helmet);
fastify.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs'),
  },
  templates: path.resolve(__dirname, './app/view'),
});
fastify.register(require('fastify-formbody'));
fastify.register(require('./app/ha-bridge'), {
  haPassword: config.ha.password,
  haUrl: config.ha.url,
});
fastify.register(require('./app/oauth'), {
  clients: config.oauth2.clients,
  users: config.oauth2.users,
});
fastify.register(require('./app/routes'), {
  serverPassword: config.serverPassword,
});

// Run the server!
fastify.listen(3000, function (err) {
  if (err) {
    throw err;
  }
  fastify.log.info(`server listening on ${fastify.server.address().port}`);
});