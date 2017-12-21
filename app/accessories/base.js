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
  async getPowerState() {
    const data = await this.ha.fetchState(this.entity_id);
    if (data) {
      return data.state;
    } else {
      throw new Error('SERVICE_ERROR');
    }
  }
}

module.exports = HomeAssistantBase;
