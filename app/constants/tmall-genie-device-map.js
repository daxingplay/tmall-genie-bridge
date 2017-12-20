/*
 * Copyright (c) 2017.
 * author: daxingplay <daxingplay@gmail.com>
 */

const switchIcon = "http://git.cn-hangzhou.oss-cdn.aliyun-inc.com/uploads/aicloud/aicloud-proxy-service/41baa00903a71c97e3533cf4e19a88bb/image.png";

module.exports = {
  group: {
    type: 'switch',
    icon: '',
    actions: [
      'TurnOn',
      'TurnOff'
    ],
    properties: [
      { key: 'powerstate', valueFrom: 'state' }
    ],
  },
  switch: {
    type: 'switch',
    actions: [
      'TurnOn',
      'TurnOff'
    ],
    properties: [
      { key: 'powerstate', valueFrom: 'state' }
    ],
  },
  light: {
    type: 'light',
    actions: [
      'TurnOn',
      'TurnOff',
      'SetBrightness',
      'AdjustUpBrightness',
      'AdjustDownBrightness',
      'SetColor',
      'QueryPowerState'
    ],
    properties: [
      { key: 'powerstate', valueFrom: 'state' }
    ],
  },
  media_player: {
    type: 'television',
    actions: [
      'TurnOn',
      'TurnOff',
      'SelectChannel'
    ],
    properties: [
      { key: 'powerstate', valueFrom: 'state' }
    ],
  },
  climate: {
    type: 'aircondition',
    actions: [
      'TurnOn',
      'TurnOff',
      'SetTemperature',
      'AdjustUpTemperature',
      'AdjustDownTemperature',
      'SetWindSpeed',
      'AdjustUpWindSpeed',
      'AdjustDownWindSpeed',
      'SetMode',
      'QueryPowerState',
      'QueryTemperature',
      'QueryWindSpeed'
    ],
    properties: [
      { key: 'powerstate', valueFrom: 'state' }
    ],
  },
  fan: {
    type: 'fan',
    actions: [
      'TurnOn',
      'TurnOff',
      'SetWindSpeed',
      'AdjustUpWindSpeed',
      'AdjustDownWindSpeed',
      'QueryPowerState',
      'QueryWindSpeed'
    ],
    properties: [
      { key: 'powerstate', valueFrom: 'state' }
    ],
  },
  sensor: {
    type: 'sensor',
  },
};