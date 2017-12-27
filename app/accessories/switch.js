'use strict';

const debug = require('debug')('ha:entity:switch');
const HomeAssistantBase = require('./base');

class HomeAssistantSwitch extends HomeAssistantBase {
  constructor(data, ha) {
    super(data, ha);
    this.domain = this.deviceType || 'switch';
  }
  async turnOn() {
    const serviceData = { entity_id: this.entity_id };
    const data = await this.ha.callService(this.domain, 'turn_on', serviceData);
    return data;
  }
  async turnOff() {
    const serviceData = { entity_id: this.entity_id };
    const data = await this.ha.callService(this.domain, 'turn_off', serviceData);
    return data;
  }
  queryPowerState() {
    if (this.data.state) {
      return {
        name: 'powerstate',
        value: this.data.state,
      };
    }
    throw new Error('SERVICE_ERROR');
  }
}

module.exports = HomeAssistantSwitch;
