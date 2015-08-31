import ControllerBase from '../controller_base';

class IntegrationController extends ControllerBase {
  constructor(integration) {
    super();
    this.integration = integration || '';
    this.routes = this.routes.concat([{
      method: ['GET'],
      path: `/integrations${this.integration}`,
      config: {
        handler: this.index,
        auth: {
          strategy: 'session'
        }
      }
    }]);
    this._logger.info({
      routes: this.routes
    }, 'added routes')
  }
  index(request, reply) {
    reply.view(`integrations${this.integration}/index`, {
      title: "Setup an Integration"
    });
  }

}

export default IntegrationController;
