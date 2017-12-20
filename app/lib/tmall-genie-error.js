/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

class TmallGenieError extends Error {
  constructor(type, payload, msg = '') {
    const msgMap = {
      DEVICE_IS_NOT_EXIST: 'device cannot be found',
      DEVICE_NOT_SUPPORT_FUNCTION: 'current action not supported',
    };
    super(msg || msgMap[type]);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TmallGenieError);
    }

    // Custom debugging information
    this.type = type;
    this.date = new Date();
    this.payload = payload;
  }
}

module.exports = TmallGenieError;
