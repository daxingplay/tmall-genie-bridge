/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const HA = require('./lib/home-assistant');

async function haBridge(fastify, options) {
  fastify.decorate('ha', new HA(options));
}

module.exports = haBridge;