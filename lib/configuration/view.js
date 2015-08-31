import vision from 'vision';
import handlebars from 'handlebars';
import logger from '../utils/logger';
import {
  merge
}
from 'lodash';
class ViewConfigurator {
  constructor() {
    this._logger = logger(this);
  }
  configure(hapi) {
    this._logger.info('registering vision');
    return hapi.registerAsync(vision)
      .then(() => {
        this._logger.info('registering hbs view handler');
        hapi.views({
          engines: {
            hbs: handlebars
          },
          isCached: false,
          relativeTo: __dirname,
          path: '../views',
          layoutPath: '../views/_layouts',
          layout: 'default',
          partialsPath: '../views/_partials'
        });
      }).then(() => {
        this._logger.info('registering pre-response handler');
        hapi.ext('onPreResponse', (request, reply) => {
          var response = request.response;
          if (response.variety === 'view') {
            var context = response.source.context || {};
            context.template = response.source.template;
            if (request.auth.isAuthenticated) {
              context.user = request.auth.credentials;
            }
            context = merge({}, request.pre.defaultOptions, context);
            context = merge({}, request.pre, context);
            this._logger.info({
              context
            }, 'context');
            response.source.context = context;
          }
          return reply(request.response);
        });
      }).catch((err) => {
        this._logger.error(err);
      });
  }
}

export default ViewConfigurator;
