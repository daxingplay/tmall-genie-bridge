/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const assert = require('assert');

async function tmallGenieStandard(request, reply, fastify) {
  const { headers: { namespace } } = request;

  assert(namespace.indexOf('AliGenie.Iot.Device.') === 0, 'not valid ali genie protocol');

  switch (namespace.replace('AliGenie.Iot.Device.', '')) {
    case 'Discovery':
  }
}

module.exports = tmallGenieStandard;