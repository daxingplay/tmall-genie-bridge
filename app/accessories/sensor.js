'use strict';

const debug = require('debug')('ha:entity:sensor');
const HomeAssistantBase = require('./base');

const supportedSensorTypes = ['battery', 'aqi', 'temperature', 'humidity'];

class HomeAssistantSensor extends HomeAssistantBase {
  constructor(data, ha) {
    super(data, ha);
    const unit = data.attributes.unit_of_measurement || '';
    this.sensorType = this.subId.split('_')[0];
    if (supportedSensorTypes.indexOf(this.sensorType) === -1) {
      this.sensorType = undefined;
    }
    if (this.subId.indexOf('battery') > -1 && unit === '%') {
      this.sensorType = 'battery';
    } else if (unit.toUpperCase() === 'AQI') {
      this.sensorType = 'aqi';
    }
    debug(`${this.entity_id} sensor type: ${this.sensorType}`);
    if (!this.sensorType) {
      throw new Error('DEVICE_NOT_SUPPORT_FUNTION');
    }
  }

  queryPowerState() {
    return {
      name: 'powerstate',
      value: 'on',
    };
  }

  queryTemperature() {
    if (this.sensorType === 'temperature') {
      return {
        name: 'temperature',
        value: parseFloat(this.data.state),
      };
    }
    return null;
  }

  queryHumidity() {
    if (this.sensorType === 'humidity') {
      return {
        name: 'humidity',
        value: parseFloat(this.data.state),
      };
    }
    return null;
  }

  queryPM25() {
    if (this.sensorType === 'aqi') {
      return {
        name: 'pm2.5',
        value: parseFloat(this.data.state),
      };
    }
    return null;
  }
}

module.exports = HomeAssistantSensor;
