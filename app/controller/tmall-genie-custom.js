/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const _ = require('lodash');

const getEntityNames = slotEntities => slotEntities.map(o => o.standardValue || o.originalValue);

const replyWords = {
  'turn_on': ['搞定', '好的', '@{device_name}已经打开'],
  'turn_off': ['搞定', '好的', '@{device_name}已经关闭'],
};

const generateReplyWords = (intent, entityName) => {
  const words = replyWords[intent] || ['好的'];
  return words[_.random(words.length - 1)].replace('@{device_name}', entityName);
};

const generateTmallGenieCustomResponse = (reply, haResponse, intent, entityName) => {
  const { success, code } = haResponse;
  const response = {
    returnCode: `${code}`,
    returnErrorSolution: '',
    returnMessage: '',
    returnValue: {
      reply: '',
      resultType: 'RESULT',
      executeCode: "ERROR",
    },
  };
  if (success === true) {
    response.returnCode = '0';
    response.returnValue.reply = generateReplyWords(intent, entityName);
    response.returnValue.executeCode = 'SUCCESS';
  } else if (code === 404) {
    response.returnValue.reply = `没有找到${entityName}`;
  } else if (code === 403) {
    response.returnValue.reply = '暂时还不支持该操作';
  } else {
    response.returnValue.reply = '操作失败';
  }
  reply
    .code(code)
    .header('Content-Type', 'application/json')
    .send(response);
};

const tmallGenieCustom = (fastify, options) => {
  return async (request, reply) => {
    if (options.serverPassword && request.headers.password === options.serverPassword) {
      let ret = { success: false, code: 500 };
      const { intentName, slotEntities } = request.body;
      const entityNames = getEntityNames(slotEntities);
      if (fastify.ha.allowedIntents.indexOf(intentName) > -1) {
        try {
          ret = await fastify.ha.exec(intentName, entityNames[0]);
        } catch (e) {}
      }
      generateTmallGenieCustomResponse(reply, ret, intentName, entityNames[0]);
    } else {
      reply.code(404); // do not let others know we have this route though 403 is more meaningful.
    }
  };
};

module.exports = tmallGenieCustom;