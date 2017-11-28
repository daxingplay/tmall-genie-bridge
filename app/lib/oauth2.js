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
      clientSecret: 'secret'
    }
  ],
  confidentialClients: [
    {
      clientId: 'confidentialApplication',
      clientSecret: 'topSecret'
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

const getAccessToken = function(bearerToken, callback) {

  const tokens = config.tokens.filter(function(token) {

    return token.accessToken === bearerToken;
  });

  return callback(false, tokens[0]);
};

const getClient = function(clientId, clientSecret, callback) {

  const clients = config.clients.filter(function(client) {

    return client.clientId === clientId && client.clientSecret === clientSecret;
  });

  const confidentialClients = config.confidentialClients.filter(function(client) {

    return client.clientId === clientId && client.clientSecret === clientSecret;
  });

  callback(false, clients[0] || confidentialClients[0]);
};

const grantTypeAllowed = function(clientId, grantType, callback) {

  let clientsSource;
  let clients = [];

  if (grantType === 'password') {
    clientsSource = config.clients;
  } else if (grantType === 'client_credentials') {
    clientsSource = config.confidentialClients;
  }

  if (!!clientsSource) {
    clients = clientsSource.filter(function(client) {

      return client.clientId === clientId;
    });
  }

  callback(false, clients.length);
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

const getUser = function(username, password, callback) {

  const users = config.users.filter(function(user) {

    return user.username === username && user.password === password;
  });

  callback(false, users[0]);
};

/*
 * Method used only by client_credentials grant type.
 */

const getUserFromClient = function(clientId, clientSecret, callback) {

  const clients = config.confidentialClients.filter(function(client) {

    return client.clientId === clientId && client.clientSecret === clientSecret;
  });

  let user;

  if (clients.length) {
    user = {
      username: clientId
    };
  }

  callback(false, user);
};

/**
 * Export model definition object.
 */

exports.generateModel = (options) => {
  return {
    getAccessToken,
    getClient,
    grantTypeAllowed,
    saveToken,
    getUser,
    getUserFromClient,
  };
};