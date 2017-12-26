'use strict';

const debug = require('debug')('ha:entity:switch');
const HomeAssistantBase = require('./base');

class HomeAssistantSwitch extends HomeAssistantBase {
  constructor(data, ha) {
    super(data, ha);
    this.domain = this.deviceType || 'switch';
  }
}

module.exports = HomeAssistantSwitch;
