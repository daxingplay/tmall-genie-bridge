/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const fp = require('fastify-plugin');
const HA = require('./lib/home-assistant');

async function haBridge(fastify, options) {
  const homeAssistant = new HA(options);
  const inst = await homeAssistant.connect();
  fastify.decorate('ha', inst);
}

module.exports = fp(haBridge);