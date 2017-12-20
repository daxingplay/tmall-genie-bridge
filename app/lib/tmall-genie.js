/*
 * Copyright (c) 2017. 
 * author: daxingplay <daxingplay@gmail.com>
 */

'use strict';

const _ = require('lodash');
const assert = require('assert');
const Entity = require('../accessories/index');
const TmallGenieError = require('./tmall-genie-error');

class TmallGenie {
  constructor(fastify) {
    this.fastify = fastify;
    this.devices = {};
  }
  wrapResponse(ret, headers) {
    return {
      header: _.assign({}, headers, {
        name: `${headers.name}Response`,
      }),
      payload: ret,
    };
  }
  wrapErrorResponse(err, headers, payload) {
    return {
      header: _.assign({}, headers, {
        name: 'ErrorResponse',
      }),
      payload: _.omitBy({
        deviceId: payload.deviceId,
        errorCode: err.type || 'SERVICE_ERROR',
        message: err.message,
      }, _.isUndefined),
    };
  }
  async invoke(headers, payload) {
    const { namespace } = headers;
    assert(namespace.indexOf('AliGenie.Iot.Device.') === 0, 'not valid ali genie protocol');

    const action = namespace.replace('AliGenie.Iot.Device.', '');
    const func = this[`invoke${action}`];
    assert(func, `this action: ${action} currently not supported.`);

    try {
      const ret = await func.call(this, headers, payload);
      return this.wrapResponse(ret, headers);
    } catch (e) {
      const err = new TmallGenieError(e.message, { headers, payload });
      return this.wrapErrorResponse(err, headers, payload);
    }
  }
  async invokeDiscovery() {
    const devices = await this.fastify.ha.discover();
    this.devices = devices
      .reduce((all, device) => {
        const entity = new Entity(device, this.fastify.ha);
        if (entity.inst) {
          return _.assign(all, {
            [entity.id]: entity,
          });
        }
        return all;
      }, {});
    return {
      devices: _.reduce(this.devices, (arr, entity) => {
        arr.push(entity.generateTmallBotDeviceInfo());
        return arr;
      }, []),
    };
  }
  async invokeControl(headers, payload) {
    const action = headers.name;
    const entityId = payload.deviceId;

    const entity = this.devices[entityId];
    assert(entity, 'DEVICE_IS_NOT_EXIST');

    const args = _.pick(payload, ['attribute', 'value', 'extensions']);
    const ret = await entity.invoke(action, args);
    return {
      deviceId: entityId
    };
  }
}

module.exports = TmallGenie;
