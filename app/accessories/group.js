/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingpay@gmail.com>
 */

'use strict';

const debug = require('debug')('ha:entity:group');
const HomeAssistantBase = require('./base');

class HomeAssistantGroup extends HomeAssistantBase {
  constructor(data, ha) {
    super(data, ha);
    this.domain = 'homeassistant';
  }
}

module.exports = HomeAssistantGroup;
