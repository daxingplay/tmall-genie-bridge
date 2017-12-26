/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

class HomeAssistantBase {
  constructor(data, ha) {
    const { attributes, entity_id } = data;
    this.data = data;
    this.ha = ha;
    this.entity_id = entity_id;
    this.uuid_base = entity_id;
    this.deviceType = this.getDeviceType();
    this.domain = this.deviceType;
    if (attributes && (attributes.tmall_bot_name || attributes.friendly_name)) {
      this.name = attributes.tmall_bot_name || attributes.friendly_name;
    } else {
      this.name = data.entity_id.split('.').pop().replace(/_/g, ' ');
    }
    if (attributes && attributes.homebridge_mfg) {
      this.mfg = String(attributes.homebridge_mfg);
    } else {
      this.mfg = 'Home Assistant';
    }
    if (attributes && attributes.homebridge_serial) {
      this.serial = String(attributes.homebridge_serial);
    } else {
      this.serial = entity_id;
    }
  }
  getDeviceType() {
    return this.entity_id.split('.')[0];
  }
  getTmallBotProperties() {
    return [];
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
  // async query() {
  //   const data = await this.ha.fetchState(this.entity_id);
  // }
  async queryPowerState() {
    if (this.data.state) {
      return {
        name: 'powerstate',
        value: this.data.state,
      };
    }
    throw new Error('SERVICE_ERROR');
  }
}

module.exports = HomeAssistantBase;
