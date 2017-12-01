/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const _ = require('lodash');

/**
 * Configuration.
 */

const config = {
  clients: [],
  confidentialClients: [],
  tokens: [],
  users: [],
  authorizationCodes: [],
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
    let checkSecret = true;
    if (clientSecret !== null) {
      checkSecret = client.clientSecret === clientSecret;
    }
    return client.clientId === clientId && checkSecret;
  });

  const confidentialClients = config.confidentialClients.filter(function(client) {

    return client.clientId === clientId && client.clientSecret === clientSecret;
  });

  const ret = clients[0] || confidentialClients[0];
  if (ret) {
    return _.assign({ id: ret.clientId }, ret);
  }
  return false;
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

const saveAuthorizationCode = function (code, client, user) {
  const ret = _.assign({
    client: { id: client.clientId },
    user: { id: user.id },
  }, code);
  config.authorizationCodes.push(ret);

  return ret;
};

const getAuthorizationCode = function (authorizationCode) {
  return config.authorizationCodes.filter(o => o.authorizationCode === authorizationCode)[0];
};

const revokeAuthorizationCode = function (code) {
  const exist = getAuthorizationCode(code.authorizationCode);
  if (exist) {
    config.authorizationCodes = config.authorizationCodes.filter(o => o.authorizationCode !== code.authorizationCode);
    return true;
  }
  return false;
};

/**
 * Export model definition object.
 */

exports.generateModel = (options) => {
  if (Array.isArray(options.clients)) {
    config.clients = options.clients.map(o => _.assign({}, o, {
      grants: ['authorization_code'],
    }));
  }
  if (Array.isArray(options.users)) {
    config.users = options.users;
  }
  return {
    getAccessToken,
    getClient,
    saveToken,
    getUser,
    getUserFromClient,
    saveAuthorizationCode,
    getAuthorizationCode,
    revokeAuthorizationCode,
  };
};