'use strict';
import bunyan from 'bunyan';

export default function logger(instance) {
  let config = {
    name: 'Hoist Demo App',
  }
  if (instance) {
    config.cls = instance.constructor.name;
  }
  return bunyan.createLogger(config);
}
