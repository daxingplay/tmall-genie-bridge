/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

/**
 * Configuration.
 */

const config = {
  clients: [
    {
      clientId: 'application',
      clientSecret: 'secret',
      redirectUris: [],
      grants: ['client_credentials', 'password'],
    }
  ],
  confidentialClients: [
    {
      clientId: 'confidentialApplication',
      clientSecret: 'topSecret',
      redirectUris: [],
      grants: ['client_credentials', 'password'],
    }
  ],
  tokens: [],
  users: [
    {
      id: '123',
      username: 'pedroetb',
      password: 'password'
    }
  ]
};

/**
 * Dump the memory storage content (for debug).
 */

const dump = function() {

  console.log('clients', config.clients);
  console.log('confidentialClients', config.confidentialClients);
  console.log('tokens', config.tokens);
  console.log('users', config.users);
};

/*
 * Methods used by all grant types.
 */

const getAccessToken = function(bearerToken) {

  const tokens = config.tokens.filter(function(token) {

    return token.accessToken === bearerToken;
  });

  return tokens[0];
};

const getClient = function(clientId, clientSecret) {

  const clients = config.clients.filter(function(client) {

    return client.clientId === clientId && client.clientSecret === clientSecret;
  });

  const confidentialClients = config.confidentialClients.filter(function(client) {

    return client.clientId === clientId && client.clientSecret === clientSecret;
  });

  return clients[0] || confidentialClients[0];
};

const saveToken = function(token, client, user) {

  const ret = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    scope: token.scope,
    client: { id: client.id },
    user: { id: user.id },
  };

  config.tokens.push(ret);

  return ret;
};

/*
 * Method used only by password grant type.
 */

const getUser = function(username, password) {

  const users = config.users.filter(function(user) {

    return user.username === username && user.password === password;
  });

  return users[0];
};

/*
 * Method used only by client_credentials grant type.
 */

const getUserFromClient = function(client) {

  // FIXME
  const clients = config.confidentialClients.filter(function(c) {

    return c.clientId === client.id;
  });

  let user;

  if (clients.length) {
    user = {
      username: client.id,
    };
  }

  return user;
};

/**
 * Export model definition object.
 */

exports.generateModel = (options) => {
  return {
    getAccessToken,
    getClient,
    saveToken,
    getUser,
    getUserFromClient,
  };
};