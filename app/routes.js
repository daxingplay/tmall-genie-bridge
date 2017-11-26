/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

// import { tmallGenieStandardWebHook } from "./schema/tmall-genie";
const tmallGenieCustom = require('./controller/tmall-genie-custom');

async function routes(fastify, options) {

  fastify.get('/', async () => {
    return { hello: 'world' };
  });

  // const opt = { schema: tmallGenieStandardWebHook };
  fastify.post('/api/tmall-genie/custom', tmallGenieCustom(fastify));

}

module.exports = routes;