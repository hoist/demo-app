import HapiAuthCookie from 'hapi-auth-cookie';
import logger from '../utils/logger';

class AuthenticationConfiguration {
  constructor() {
    this._logger = logger(this);
  }
  configure(hapi) {
    this._logger.info('registering hapi-auth-cookie');
    return hapi.registerAsync(HapiAuthCookie)
      .then(() => {
        this._logger.info('registering strategy');
        hapi.auth.strategy('session', 'cookie', {
          password: 'secret',
          cookie: 'sid-example',
          redirectTo: '/session/create',
          isSecure: false
        });
      });
  }
}

export default AuthenticationConfiguration;
