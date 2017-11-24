/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const axios = require('axios');

class HomeAssistant {
  constructor(options) {
    this.haPassword = options.haPassword;
    this.states = [];
    this.discover();
  }
  async invoke(api, method = 'get') {
    return await axios[method](api, {
      headers: {
        'x-ha-access': this.haPassword,
        'Content-Type': 'application/json',
      },
    });
  }
  async discover() {
    this.states = await this.invoke('/api/states', 'get');
  }
}

module.exports = HomeAssistant;