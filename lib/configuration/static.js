'use strict';
import inert from 'inert';
import logger from '../utils/logger';
class StaticFileConfigurator {
  constructor() {
    this._logger = logger(this);
  }
  configure(hapi) {
    this._logger.info('registering inert');
    return hapi.registerAsync(inert).catch((err) => {
      this._logger.error(err);
    });;
  }
}

export default StaticFileConfigurator;
