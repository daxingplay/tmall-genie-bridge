/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingpay@gmail.com>
 */

'use strict';

const debug = require('debug')('ha:entity:group');
const HomeAssistantSwitch = require('./switch');

class HomeAssistantGroup extends HomeAssistantSwitch {
  constructor(data, ha) {
    super(data, ha);
    this.domain = 'homeassistant';
  }
}

module.exports = HomeAssistantGroup;
