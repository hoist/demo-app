import ControllerBase from './controller_base';
import {
  find
}
from 'lodash';
let users = [{
  username: 'jamie',
  password: 'jamie',
  displayName: 'Jamie',
  _id: '5074193836'
}]


class SessionController extends ControllerBase {
  constructor() {
    super();
    this.routes = this.routes.concat([{
      method: ['GET', 'POST'],
      path: '/session/create',
      config: {
        handler: this.create,
        auth: {
          mode: 'try',
          strategy: 'session'
        },
        plugins: {
          'hapi-auth-cookie': {
            redirectTo: false
          }
        }
      }
    },{
      method: ['GET', 'POST'],
      path: '/session/destroy',
      config: {
        handler: this.destroy,
        auth: {
          mode: 'try',
          strategy: 'session'
        },
        plugins: {
          'hapi-auth-cookie': {
            redirectTo: false
          }
        }
      }
    }]);
  }
  create(request, reply) {

    return Promise.resolve()
      .then(() => {
        if (request.auth.isAuthenticated) {
          this._logger.info('already authenticated');
          return reply.redirect('/');
        }

        if (request.method === 'post' && request.payload.username) {
          this._logger.info('finding user');
          var user = find(users, (user) => {
            return user.username.toLowerCase() === request.payload.username.toLowerCase();
          });
          if (user) {
            if (user.password === request.payload.password) {
              this._logger.info('setting session');
              request.auth.session.set(user);
              this._logger.info('redirecting');
              return reply.redirect('/')
            } else {
              this._logger.info('password doesn\'t match');
            }
          } else {
            this._logger.info('no matching user');
          }
        } else if (request.method === 'post') {
          this._logger.info('no username supplied');
        }
        return reply.view('session/create', {
          title: 'Login'
        });
      });
  }
  destroy(request, reply) {
    this._logger.info('destroying session');
    request.auth.session.clear();
    return reply.redirect('/');
  };

}
export default SessionController;
