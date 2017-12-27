/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

'use strict';

const _ = require('lodash');
const debug = require('debug')('ha:entity');
const assert = require('assert');
const Fan = require('./fan');
const Switch = require('./switch');
const Group = require('./group');
const Sensor = require('./sensor');
const tmallGenieConstants = require('../constants/tmall-genie');

const entityMap = {
  Fan,
  Switch,
  Group,
  Sensor,
  BinarySensor: Sensor,
};

class Entity {
  constructor(data, ha) {
    this.data = data;
    this.ha = ha;
    this.id = this.data.entity_id;
    this.deviceType = this.getDeviceType();
    this.deviceName = this.getDeviceName();
    this.inst = this.createInstance();
    this.allowedActions = this.getAllowedActions();
  }
  getDeviceName() {
    const { tmall_bot_name, tmall_genie_name, friendly_name } = this.data.attributes;
    return tmall_bot_name || tmall_genie_name || friendly_name;
  }
  createInstance() {
    const cls = entityMap[_.upperFirst(_.camelCase(this.deviceType))];
    if (cls) {
      try {
        return new cls(this.data, this.ha);
      } catch (e) {
        debug(`unsupported device: ${this.id}`);
        return null;
      }
    }
    return null;
  }
  getAllowedActions() {
    if (this.inst) {
      const allowedControls = tmallGenieConstants.control.reduce((allowedActions, func) => {
        const f = _.camelCase(func);
        if (_.isFunction(this.inst[f])) {
          return allowedActions.concat(func);
        }
        return allowedActions;
      }, []);
      const allowedQueries = tmallGenieConstants.query.reduce((allowedActions, func) => {
        const f = _.camelCase(func);
        if (_.isFunction(this.inst[f]) && _.isObject(this.inst[f]())) {
          return allowedActions.concat(func);
        }
        return allowedActions;
      }, []);
      if (allowedQueries.length) {
        allowedQueries.unshift('Query');
      }
      return allowedControls.concat(allowedQueries);
    }
    return [];
  }
  getDeviceType() {
    return this.data.entity_id.split('.')[0];
  }
  generateTmallBotDeviceInfo() {
    if (this.inst) {
      return {
        deviceId: this.data.entity_id,
        deviceName: this.deviceName,
        deviceType: this.deviceType,
        zone: '', // optional
        brand: this.inst.mfg || 'HomeAssistant',
        model: this.inst.model,
        icon: '',
        properties: this.inst.getTmallBotProperties(),
        actions: this.allowedActions,
        // "extensions":{
        //   "extension1":"",
        //   "extension2":""
        // },
      };
    }
    return null;
  }
  async invoke(action, args) {
    assert(this.allowedActions.indexOf(action) > -1, 'DEVICE_NOT_SUPPORT_FUNCTION');

    const func = _.camelCase(action);
    const ret = await this.inst[func].call(this.inst, args);
    return ret;
  }
}

module.exports = Entity;
