import http from 'http';
import { parseBody } from '../utils/bodyParser';
import { parseURL } from '../utils/urlParser';
import { sendWrongUrlError } from '../utils/errorSenders';
import { UserService } from '../userService';

enum ENDPOINTS {
  USERS = '/api/users',
}

enum METHODS {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export class Controller {
  DBPort: number;
  userService: UserService;

  constructor(DBport: number) {
    this.DBPort = DBport;
    this.userService = new UserService(DBport);
    this.listener = this.listener.bind(this);
  }

  async listener(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
  ) {
    try {
      const { url, method } = req;
      const body = ['POST', 'PUT'].includes(method)
        ? await parseBody(req)
        : null;
      const { path } = parseURL(url);
      console.log('handled by worker with PID', process.pid);

      switch (method) {
        case METHODS.GET:
          switch (true) {
            case path === ENDPOINTS.USERS:
              this.userService.getAllUsers(res);
              break;
            case path.startsWith(ENDPOINTS.USERS):
              this.userService.getUser(res, path);
              break;
            default:
              sendWrongUrlError(res);
          }
          break;

        case METHODS.POST:
          switch (true) {
            case path === ENDPOINTS.USERS:
              this.userService.addUser(res, body);
              break;
            default:
              sendWrongUrlError(res);
          }
          break;

        case METHODS.DELETE:
          switch (true) {
            case path.startsWith(ENDPOINTS.USERS):
              this.userService.deleteUser(res, path);
              break;
            default:
              sendWrongUrlError(res);
          }
          break;

        case METHODS.PUT:
          switch (true) {
            case path.startsWith(ENDPOINTS.USERS):
              this.userService.updateUser(res, path, body);
              break;
            default:
              sendWrongUrlError(res);
          }
          break;
        default:
          sendWrongUrlError(res);
      }
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end("Oops!.. It's not you, it's me :(");
    }
  }
}
