import ControllerBase from './controller_base';
import Hoist from 'hoist-node-sdk';
class ContactController extends ControllerBase {
  constructor() {
    super();
    this.routes = this.routes.concat([{
      method: ['POST'],
      path: '/contact/new',
      config: {
        handler: this.createContact,
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
  createContact(request, reply) {
    var payload = {
      firstname: request.payload.firstname,
      lastname: request.payload.lastname,
      email: request.payload.email,
      saleslead: request.payload.saleslead,
      bucket: request.auth.credentials._id
    };
    return Hoist.raise("contact:new", payload).then(() => {
      reply.redirect('/');
    });
  }
}
export default ContactController;
