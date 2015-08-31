import ControllerBase from './controller_base';

class RootController extends ControllerBase {
  constructor() {
    super();
    this.routes = this.routes.concat([{
      method: ['GET'],
      path: '/',
      config: {
        handler: this.index
      }
    }]);
  }
  index(request, reply) {
    reply.view('root/index', {
      title: 'Welcome'
    });
  }
}
export default RootController;
