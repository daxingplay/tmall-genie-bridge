/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

import { tmallGenieStandardWebHook } from "./schema/tmall-genie";

async function routes(fastify, options) {

  fastify.get('/', async () => {
    return { hello: 'world' };
  });

  // const opt = { schema: tmallGenieStandardWebHook };
  fastify.post('/api/tmall-genie', async (request, reply) => {});

}

module.exports = routes;