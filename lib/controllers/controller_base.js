'use strict';
import logger from '../utils/logger';
import Boom from 'boom';

class ControllerBase {
  constructor() {
    this.routes = [];
    this._logger = logger(this);
    this.defaultOptions = {};
  }
  onError(request, reply, error) {
    this._logger.error(error);
    if (error instanceof _mongoose.Error) {
      if (error instanceof _mongoose.Error.ValidationError) {
        var boom = Boom.badRequest(error.message);
        boom.output.payload.errors = error.errors;
        error = boom;
      }
    }
    if (error.isBoom) {
      this._logger.info('sending boom');
      reply(error);
    } else {
      this._logger.info('sending boom');
      reply(Boom.wrap(error));
    }
  }
}


export default ControllerBase;
