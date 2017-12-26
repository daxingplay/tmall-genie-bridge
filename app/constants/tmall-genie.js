/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

module.exports = {
  control: [
    'TurnOn',
    'TurnOff',
    'SelectChannel',
    'AdjustUpChannel',
    'AdjustDownChannel',
    'AdjustUpVolume',
    'AdjustDownVolume',
    'SetVolume',
    'SetMute',
    'CancelMute',
    'Play',
    'Pause',
    'Continue',
    'Next',
    'Previous',
    'SetBrightness',
    'AdjustUpBrightness',
    'AdjustDownBrightness',
    'SetTemperature',
    'AdjustUpTemperature',
    'AdjustDownTemperature',
    'SetWindSpeed',
    'AdjustUpWindSpeed',
    'AdjustDownWindSpeed',
    'SetMode',
    'SetColor',
    'OpenFunction',
    'CloseFunction'
  ],
  query: [
    'Query',
    'QueryColor',
    'QueryPowerState',
    'QueryTemperature',
    'QueryHumidity',
    'QueryWindSpeed',
    'QueryBrightness',
    'QueryFog',
    'QueryMode',
    'QueryPM25',
    'QueryDirection',
    'QueryAngle'
  ],
  propertyMap: {
    powerstate: {
      from: 'state',
      values: ['on', 'off'],
    },
    color: {},
    temperature: {},
    windspeed: {},
    brightness: {},
    fog: {},
    humidity: {},
    'pm2.5': {},
    channel: {},
    number: {},
    direction: {
      values: ['left', 'right', 'forward', 'back', 'up', 'down'],
    },
    angle: {},
    anion: {
      values: ['on', 'off'],
    },
    effluent: {
      values: ['on', 'off'],
    },
    mode: {},
    lefttime: {},
    remotestatus: {},
  },
};
