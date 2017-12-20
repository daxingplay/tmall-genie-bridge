/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

'use strict';

const _ = require('lodash');
const assert = require('assert');
const Fan = require('./fan');
const Switch = require('./switch');

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
    const entityMap = {
      Fan, Switch
    };
    const cls = entityMap[_.upperFirst(_.camelCase(this.deviceType))];
    if (cls) {
      return new cls(this.data, this.ha);
    }
    return null;
  }
  getAllowedActions() {
    const funcMap = {
      setPowerState: ['TurnOn', 'TurnOff'],
    };
    return _.reduce(funcMap, (allowedActions, mappedActions, func) => {
      if (this.inst && _.isFunction(this.inst[func])) {
        return allowedActions.concat(mappedActions);
      }
      return allowedActions;
    }, []);
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

    let ret;
    switch (action) {
      case 'TurnOn':
        ret = await this.inst.setPowerState(true);
        break;
      case 'TurnOff':
        ret = await this.inst.setPowerState(false);
        break;
      default:
        break;
    }
  }
}

module.exports = Entity;
