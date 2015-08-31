import Static from './static';
import View from './view';
import config from 'config';
import Logging from './logging';
import Authentication from './Authentication';

class Configuration {
  constructor() {
    this._static = new Static();
    this._view = new View();
    this._logging = new Logging();
    this._authentication = new Authentication();
  }
  apply(hapi) {
    hapi.connection({
      address: config.get('hapi.address'),
      port: config.get('hapi.port'),
      host: config.get('hapi.address')
    });
    return Promise.all([
      this._static.configure(hapi),
      this._view.configure(hapi),
      this._logging.configure(hapi),
      this._authentication.configure(hapi)
    ]);
  }
}

export default Configuration;
