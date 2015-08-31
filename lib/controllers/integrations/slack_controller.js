import IntegrationController from './integration_controller';
import Hoist from 'hoist-node-sdk';
import config from 'config';
import Boom from 'boom';
class SlackController extends IntegrationController {
  constructor() {
    super('/slack');
    this.routes = this.routes.concat([{
      method: ['GET'],
      path: `/integrations/slack/connect`,
      config: {
        handler: this.connect,
        auth: {
          strategy: 'session'
        }
      }
    }, {
      method: ['GET'],
      path: `/integrations/slack/connected`,
      config: {
        handler: this.connected,
        auth: {
          strategy: 'session'
        }
      }
    }]);

  }
  connect(request, reply) {
    return Hoist.getBounceURL({
      connector: config.get('Hoist.slack.connectorKey'),
      bucketKey: request.auth.credentials.username,
      returnUrl: request.server.info.uri + "/integrations/slack/connected"
    }).then((url) => {
      this._logger.info({
        url: url
      }, 'redirecting to Hoist');
      return reply.redirect(url);
    }).catch((err) => {
      reply(Boom.wrap(err));
    });
  }
  connected(request, reply) {
    this._logger.info(request.auth);
    let credentials = request.auth.credentials;
    credentials.connected = true;
    request.auth.session.set(credentials);
    reply.redirect('/');
  }
}

export default SlackController;
