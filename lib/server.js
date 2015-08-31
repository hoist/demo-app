import {
  Server as Hapi
}
from 'hapi';
import config from 'config';
import Router from './utils/router';
import logger from './utils/logger';
import Configuration from './configuration';
import Bluebird from 'bluebird';
import Hoist from 'hoist-node-sdk';
class Server {
  constructor() {
    this._logger = logger(this);
    this._router = new Router();
    this._configuration = new Configuration();
  }
  start() {
    Hoist.setApiKey(config.get('Hoist.apiKey'));
    this._hapi = new Hapi();
    Bluebird.promisifyAll(this._hapi);
    return this._configuration.apply(this._hapi)
      .then(() => {
        return this._router.apply(this._hapi);
      })
      .then(() => {
        return this._hapi.startAsync();
      })
      .then(() => {
        this._logger.info('Server running at:', this._hapi.info.uri);
      });
  }
}

export default Server;
