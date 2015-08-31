'use strict';
import logger from './logger';
import path from 'path';
import glob from 'glob';
import Bluebird from 'bluebird';
import ControllerBase from '../controllers/controller_base.js';
import {
  isFunction
}
from 'lodash';
let globAsync = Bluebird.promisify(glob);

class Router {
  constructor() {
    this._logger = logger(this);
  }
  apply(hapi) {
    return globAsync(path.resolve(__dirname, '../controllers/**/*.js'))
      .then((controllerFiles) => {
        this._logger.info({
          files: controllerFiles.length
        }, 'loaded controller files');
        controllerFiles.forEach((file) => {
          let Controller = require(file);
          if ((!Controller) || (!isFunction(Controller)) || (Controller === ControllerBase)) {
            return;
          }
          let controller = new Controller();
          if (!controller instanceof ControllerBase) {
            return;
          }
          this._logger.info({
            controller: controller.constructor.name
          }, 'registering controller');
          hapi.route(controller.routes.map((route) => {
            route.config = route.config || {};
            let originalHandler = route.config.handler || route.handler;
            delete route.handler;
            if (!route.config.auth) {
              route.config.auth = {
                mode: 'try',
                strategy: 'session'
              }

              if (!route.config.plugins || !route.config.plugins['hapi-auth-cookie']) {
                route.config.plugins = route.config.plugins || {};
                route.config.plugins['hapi-auth-cookie'] = {
                  redirectTo: false
                };

              }
            }
            route.config.handler = function (request, reply) {
              //always catch errors
              Promise.resolve(originalHandler.apply(controller, arguments))
                .catch((err) => {
                  controller.onError(request, reply, err);
                });
            };
            route.config.bind = controller;
            route.config.pre = [];
            route.config.pre.push({
              method: (request, reply) => {
                reply(controller.defaultOptions);
              },
              assign: 'defaultOptions'
            });
            return route;
          }));
        });
      });
  }
}

export default Router;
