/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

class HomeAssistantBase {
  constructor(data, ha) {
    this.data = data;
    this.ha = ha;
    this.entity_id = data.entity_id;
  }
}

module.exports = HomeAssistantBase;
