import HapiBunyan from 'hapi-bunyan';
import Good from 'good';
import Poop from 'poop';
import path from 'path';
import GoodConsole from 'good-console';
import logger from '../utils/logger';
class LoggingConfiguration {
  constructor() {
    this._logger = logger(this);
  }
  configure(hapi) {
    this._logger.info('registering good');
    return hapi.registerAsync({
      register: Good,
      options: {
        opsInterval: 1000,
        reporters: [{
          reporter: GoodConsole,
          events: {
            log: '*',
            response: '*'
          }
        }]
      }
    }).then(() => {
      this._logger.info('registering bunyan');
      return hapi.registerAsync({
        register: HapiBunyan,
        options: {
          logger: this._logger
        }
      })
    }).then(() => {
      this._logger.info('registering poop');
      return hapi.registerAsync({
        register: Poop,
        options: {
          logPath: path.join(process.cwd(), 'poop.log')
        }
      });
    }).catch((err) => {
      this._logger.error(err);
    });

  }
}

export default LoggingConfiguration;
