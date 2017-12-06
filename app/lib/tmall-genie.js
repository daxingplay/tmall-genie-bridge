/*
 * Copyright (c) 2017. 
 * author: daxingplay <daxingplay@gmail.com>
 */

const _ = require('lodash');
const assert = require('assert');
const tmallGenieDeviceTypeMap = require('../constants/tmall-genie-device-type-map');

class TmallGenie {
  constructor(fastify) {
    this.fastify = fastify;
  }
  wrapResponse(ret, headers) {
    return {
      header: _.assign({}, headers, {
        name: `${headers.name}Response`,
      }),
      payload: ret,
    };
  }
  getDeviceName({ friendly_name, haaska_name, tmall_genie_name }) {
    return tmall_genie_name || haaska_name || friendly_name;
  }
  convertDeviceType(entityId) {
    const curType = entityId.split('.')[0];
    return tmallGenieDeviceTypeMap[curType];
  }
  async invoke(headers, payload) {
    const { namespace } = headers;
    assert(namespace.indexOf('AliGenie.Iot.Device.') === 0, 'not valid ali genie protocol');

    const action = namespace.replace('AliGenie.Iot.Device.', '');
    const func = this[`invoke${action}`];
    assert(func, `this action: ${action} currently not supported.`);

    const ret = await func(headers, payload);
    return this.wrapResponse(ret, headers);
  }
  async invokeDiscovery(headers, payload) {
    const devices = await this.fastify.ha.discover();
    return {
      devices: devices
        .filter(o => !!o)
        .map(({ attributes, entity_id }) => ({
          "deviceId": entity_id,
          "deviceName": this.getDeviceName(attributes),
          "deviceType": this.convertDeviceType(entity_id),
          "zone": "", // optional
          "brand": "HA",
          "model": "HA",
          "icon":"http://git.cn-hangzhou.oss-cdn.aliyun-inc.com/uploads/aicloud/aicloud-proxy-service/41baa00903a71c97e3533cf4e19a88bb/image.png",
          "properties":[{
            "name":"color",
            "value":"Red"
          }],
          "actions":[
            "TurnOn",
            "TurnOff",
            "SetBrightness",
            "AdjustBrightness",
            "SetTemperature",
            "Query"          //  查询的也请返回
          ],
          // "extensions":{
          //   "extension1":"",
          //   "extension2":""
          // },
        })),
    };
  }
}

module.exports = TmallGenie;