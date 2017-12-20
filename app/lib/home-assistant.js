/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const _ = require('lodash');
const axios = require('axios');

const intentsConfig = {
  'turn_on': {
    domain: 'homeassistant',
    service: 'turn_on',
    params: ['entity_id'],
  },
  'turn_off': {
    domain: 'homeassistant',
    service: 'turn_off',
    params: ['entity_id'],
  },
};

class HomeAssistant {
  constructor(options) {
    this.haPassword = options.haPassword;
    this.haUrl = options.haUrl;
    this.states = [];
    this.allowedIntents = Object.keys(intentsConfig);
  }
  getEntityByName(name) {
    for (let i = 0; i < this.states.length; i++) {
      const state = this.states[i];
      const { attributes: { friendly_name, haaska_name, tmall_genie_name, hidden } } = state;
      if (hidden !== true) {
        const n = tmall_genie_name || haaska_name;
        if ((n && n === name) || (friendly_name === name)) {
          return _.merge({}, state);
        }
      }
    }
    return null;
  }
  async invoke(api, method = 'get', payload) {
    const url = this.haUrl + api;
    const { data } = await axios({
      method,
      url,
      headers: {
        'x-ha-access': this.haPassword,
        'Content-Type': 'application/json',
      },
      data: payload,
    });
    return data;
  }
  async connect() {
    const { message } = await this.invoke('/api/');
    if (message) {
      await this.discover();
    }
    return this;
  }
  async discover() {
    this.states = await this.invoke('/api/states', 'get');
    return this.states;
  }
  async exec(intent, entityName) {
    const { domain, service, params } = intentsConfig[intent];
    const entity = this.getEntityByName(entityName);
    if (entity) {
      const payload = params.reduce((o, param) => ({
        ...o,
        [param]: entity[param]
      }), {});
      const data = await this.invoke(`/api/services/${domain}/${service}`, 'post', payload);
      if (data) {
        return { success: true, code: 200 };
      }
      return { success: false, code: 500, msg: `exec ${intent} on ${entityName} error` };
    }
    return { success: false, code: 404, msg: `${entityName} not found` };
  }
}

module.exports = HomeAssistant;