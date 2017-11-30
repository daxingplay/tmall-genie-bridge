/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const _ = require('lodash');
const fp = require('fastify-plugin');
const OAuth2Server = require('oauth2-server');
const oauthModel = require('./lib/oauth2.js');

async function oauth2(fastify, options) {
  const model = oauthModel.generateModel(options);
  const server = new OAuth2Server({
    model,
  });
  fastify.decorate('oauth', server);

  fastify.post('/oauth2/token', async (request, reply) => {
    const req = new OAuth2Server.Request();
    const res = new OAuth2Server.Response();
    await fastify.oauth.token(req, res);
    reply
      .code(res.status)
      .headers(res.headers)
      .send(res.body);
  });

  fastify.all('/oauth2/auth', async (request, reply) => {
    const { req: { method, url }, query, headers, body } = request;
    if (method === 'GET') {
      reply
        .view('login.ejs', {
          token: '',
          url,
        });
    } else if (method === 'POST') {
      const authStr = new Buffer(`${body.username}:${body.password}`).toString('base64');
      const req = new OAuth2Server.Request({
        method, query, body,
        headers: _.assign({}, headers, {
          Authorization: `Basic ${authStr}`,
        }),
      });
      const res = new OAuth2Server.Response();
      await fastify.oauth.authorize(req, res);

    } else {
      reply.code(400);
    }
  });

  fastify.all('/api/tmall-genie/standard', function (request, reply) {
    const req = new OAuth2Server.Request();
    const res = new OAuth2Server.Response();
    fastify.oauth.authenticate(req, res);
    reply.send('Congratulations, you are in a secret area!');
  });

}

module.exports = fp(oauth2);