/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const assert = require('assert');
const TmallGenie = require('../lib/tmall-genie');


const tmallGenieStandard = (fastify, options) => {
  const tmallGenie = new TmallGenie(fastify);
  return async (request, reply) => {
    const { header, payload } = request.body;

    assert(header, 'header not exists');
    assert(payload, 'payload not exists');

    const ret = await tmallGenie.invoke(header, payload);
    reply.code(200).send(ret);
  };
};


module.exports = tmallGenieStandard;