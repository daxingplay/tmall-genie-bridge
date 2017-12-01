/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

module.exports = {
  ha: {
    password: process.env.HA_PASSWORD,
    url: process.env.HA_URL,
  },
  serverPassword: process.env.PASSWORD,
  oauth2: {
    clients: [
      {
        clientId: 'application',
        clientSecret: 'secret',
        redirectUris: ['https://open.bot.tmall.com/oauth/callback'],
        grants: ['authorization_code'],
      }
    ],
    users: [
      {
        id: '123',
        username: 'daxingplay',
        password: '123'
      }
    ],
  },
};