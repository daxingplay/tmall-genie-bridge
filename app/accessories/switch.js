'use strict';

const debug = require('debug')('ha:entity:switch');
const HomeAssistantBase = require('./base');

class HomeAssistantSwitch extends HomeAssistantBase {
  constructor(data, ha) {
    super(data, ha);
    this.domain = type || 'switch';
  }
  async turnOn() {
    const callDomain = this.domain === 'group' ? 'homeassistant' : this.domain;
    const serviceData = { entity_id: this.entity_id };
    const data = await this.ha.callService(callDomain, 'turn_on', serviceData);
  }
  async setPowerState(powerOn) {
    const that = this;
    const serviceData = {};
    serviceData.entity_id = this.entity_id;
    var callDomain = this.domain === 'group' ? 'homeassistant' : this.domain;

    if (powerOn) {
      this.log(`Setting power state on the '${this.name}' to on`);

      this.client.callService(callDomain, 'turn_on', serviceData, (data) => {
        if (this.domain === 'scene' || (this.domain === 'script' && !(this.data.attributes.can_cancel))) {
          setTimeout(() => {
            this.service.getCharacteristic(Characteristic.On)
              .setValue(false, null, 'internal');
          }, 500);
        }
        if (data) {
          that.log(`Successfully set power state on the '${that.name}' to on`);
          callback();
        } else {
          callback(communicationError);
        }
      });
    } else {
      this.log(`Setting power state on the '${this.name}' to off`);

      this.client.callService(callDomain, 'turn_off', serviceData, (data) => {
        if (data) {
          that.log(`Successfully set power state on the '${that.name}' to off`);
          callback();
        } else {
          callback(communicationError);
        }
      });
    }
  }
  getServices() {
    let model;

    switch (this.domain) {
      case 'scene':
        if (this.data.attributes && this.data.attributes.homebridge_model) {
          model = String(this.data.attributes.homebridge_model);
        } else {
          model = 'Scene';
        }
        break;
      case 'input_boolean':
        if (this.data.attributes && this.data.attributes.homebridge_model) {
          model = String(this.data.attributes.homebridge_model);
        } else {
          model = 'Input Boolean';
        }
        break;
      case 'group':
        if (this.data.attributes && this.data.attributes.homebridge_model) {
          model = String(this.data.attributes.homebridge_model);
        } else {
          model = 'Group';
        }
        break;
      case 'switch':
        if (this.data.attributes && this.data.attributes.homebridge_model) {
          model = String(this.data.attributes.homebridge_model);
        } else {
          model = 'Switch';
        }
        break;
      case 'remote':
        if (this.data.attributes && this.data.attributes.homebridge_model) {
          model = String(this.data.attributes.homebridge_model);
        } else {
          model = 'Remote';
        }
        break;
      case 'automation':
        if (this.data.attributes && this.data.attributes.homebridge_model) {
          model = String(this.data.attributes.homebridge_model);
        } else {
          model = 'Automation';
        }
        break;
      case 'vacuum':
        if (this.data.attributes && this.data.attributes.homebridge_model) {
          model = String(this.data.attributes.homebridge_model);
        } else {
          model = 'Vacuum';
        }
        break;
      case 'script':
        if (this.data.attributes && this.data.attributes.homebridge_model) {
          model = String(this.data.attributes.homebridge_model);
        } else {
          model = 'Script';
        }
        break;
      default:
        model = 'Switch';
    }

    this.service = new Service.Switch();
    if (this.data && this.data.attributes && this.data.attributes.homebridge_switch_type === 'outlet') {
      this.service = new Service.Outlet();
      if (this.data.attributes && this.data.attributes.homebridge_model) {
        model = String(this.data.attributes.homebridge_model);
      } else {
        model = 'Outlet';
      }
      this.service
        .getCharacteristic(Characteristic.OutletInUse)
        .on('get', this.getPowerState.bind(this));
    }
    const informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, this.mfg)
      .setCharacteristic(Characteristic.Model, model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial);

    if (this.domain === 'remote' || this.domain === 'switch' || this.domain === 'input_boolean' || this.domain === 'group' || this.domain === 'automation' || this.domain === 'vacuum' || (this.domain === 'script' && this.data.attributes.can_cancel)) {
      this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getPowerState.bind(this))
        .on('set', this.setPowerState.bind(this));
    } else {
      this.service
        .getCharacteristic(Characteristic.On)
        .on('set', this.setPowerState.bind(this));
    }

    return [informationService, this.service];
  }
}

module.exports = HomeAssistantSwitch;
