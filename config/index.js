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
    accessTokenLifetime: 3 * 24 * 60 * 60,
    clients: [
      {
        clientId: 'application',
        clientSecret: 'secret',
        redirectUris: ['https://open.bot.tmall.com/oauth/callback'],
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