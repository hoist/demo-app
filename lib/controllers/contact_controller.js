import ControllerBase from './controller_base';
import Hoist from 'hoist-node-sdk';
class ContactController extends ControllerBase {
  constructor() {
    super();
    this.routes = this.routes.concat([{
      method: ['POST'],
      path: '/contact/new',
      config: {
        handler: this.createContact
      }
    }]);
  }
  createContact(request, reply) {
    return Hoist.raise("contact:new", request.payload).then(() => {
      reply.redirect('/');
    });
  }
}
export default ContactController;
