/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const fp = require('fastify-plugin');
const oauth2server = require('oauth2-server');
const oauthModel = require('./lib/oauth2.js');

function oauth2(fastify, options) {
  const model = oauthModel.generateModel(options);
  fastify.decorate('oauth', oauth2server({
    model,
    grants: ['password', 'client_credentials'],
    debug: true
  }));

  fastify.all('/oauth/token', fastify.oauth.grant());

}

module.exports = fp(oauth2);