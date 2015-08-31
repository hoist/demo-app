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
    }]);

  }
  connect(request, reply) {
    return Hoist.getBounceURL({
      connector: config.get('Hoist.slack.connectorKey'),
      bucketKey: request.auth.credentials.username
        //returnUrl: request.server.info.uri + "/integrations/slack/connected"
    }).then((url) => {
      this._logger.info({
        url: url
      }, 'redirecting to Hoist');
      return reply.redirect(url);
    }).catch((err) => {
      reply(Boom.wrap(err));
    });
  }
}

export default SlackController;
