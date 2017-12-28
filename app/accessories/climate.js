'use strict';

const _ = require('lodash');
const debug = require('debug')('ha:entity:climate');
const HomeAssistantBase = require('./base');
const { propertyMap } = require('../constants/tmall-genie');

function fahrenheitToCelsius(temperature) {
  return (temperature - 32) / 1.8;
}

function getTempUnits(data) {
  // determine HomeAssistant temp. units (celsius vs. fahrenheit)
  // defaults to celsius
  return (data.attributes && data.attributes.unit_of_measurement && data.attributes.unit_of_measurement === '°F') ? 'FAHRENHEIT' : 'CELSIUS';
}

class HomeAssistantClimate extends HomeAssistantBase {
  constructor(data, ha) {
    super(data, ha);
    this.domain = 'climate';
    if (!this.model) {
      this.model = 'Climate';
    }
    this.icon = 'https://img2.ojcdn.com/hass/icons/air-conditioner.png';
  }
  async turnOn() {
    const serviceData = {
      entity_id: this.entity_id,
      operation_mode: 'Auto',
    };
    const data = await this.ha.callService(this.domain, 'set_operation_mode', serviceData);
    return data;
  }
  async turnOff() {
    const serviceData = {
      entity_id: this.entity_id,
      operation_mode: 'Off',
    };
    const data = await this.ha.callService(this.domain, 'set_operation_mode', serviceData);
    return data;
  }
  async setTemperature({ attribute, value }) {
    let temp = parseFloat(value);
    const { min_temp: minTemp, max_temp: maxTemp } = this.data.attributes;
    if (!_.isUndefined(minTemp) && temp < minTemp) {
      temp = minTemp;
    } else if (!_.isUndefined(maxTemp) && temp > maxTemp) {
      temp = maxTemp;
    }
    const serviceData = {
      entity_id: this.entity_id,
      temperature: value,
    };
    const data = await this.ha.callService(this.domain, 'set_temperature', serviceData);
    return data;
  }
  async adjustUpTemperature() {
    const curTemperature = this.data.attributes.temperature;
    return this.setTemperature(curTemperature + 0.5);
  }
  async adjustDownTemperature() {
    const curTemperature = this.data.attributes.temperature;
    return this.setTemperature(curTemperature - 0.5);
  }
  async setWindSpeed({ attribute, value }) {
    let fanMode = value;
    const fanModeList = this.data.attributes.fan_list || ['auto', 'low', 'medium', 'high'];
    if (fanModeList.indexOf(fanMode) === -1) {
      if (fanMode === 'medium') {
        fanMode = 'middle';
      } else {
        throw new Error('SERVICE_ERROR');
      }
    }
    const serviceData = {
      entity_id: this.entity_id,
      fan_mode: fanMode,
    };
    const data = await this.ha.callService(this.domain, 'set_fan_mode', serviceData);
    return data;
  }
  async setMode({ attribute, value }) {
    if (propertyMap.mode.values[value]) {
      const serviceData = {
        entity_id: this.entity_id,
        operation_mode: value,
      };
      const data = await this.ha.callService(this.domain, 'set_operation_mode', serviceData);
      return data;
    }
    throw new Error('DEVICE_NOT_SUPPORT_FUNCTION');
  }
  queryTemperature() {
    const unit = getTempUnits(this.data);
    const temp = this.data.attributes.current_temperature || this.data.attributes.temperature;
    let ret = temp;
    if (unit === 'FAHRENHEIT') {
      ret = fahrenheitToCelsius(temp);
    }
    return {
      name: 'temperature',
      value: ret,
    };
  }
  queryMode() {
    const { mode } = this.data.attributes;
    if (mode) {
      if (propertyMap.mode.values[mode] || mode === 'off') {
        return {
          name: 'mode',
          value: mode,
        };
      }
    }
    return null;
  }
  queryPowerState() {
    const mode = this.queryMode();
    return {
      name: 'powerstate',
      value: mode === 'off' ? 'off' : 'on',
    };
  }
}

module.exports = HomeAssistantClimate;
