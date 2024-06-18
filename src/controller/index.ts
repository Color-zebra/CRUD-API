import http from 'http';
import { parseBody } from '../utils/bodyParser';
import { parseURL } from '../utils/urlParser';
import { sendWrongUrlError } from '../utils/sendWrongUrlError';

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
  constructor() {}

  listener = async (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
  ) => {
    try {
      const { url, method, headers } = req;
      const body = await parseBody(req);
      const { path, query } = parseURL(url);

      console.log(path, method, ENDPOINTS.USERS);

      switch (method) {
        case METHODS.GET:
          switch (true) {
            case path === ENDPOINTS.USERS:
              console.log('get all users service');
              res.end('get all users service');
              break;
            case path.startsWith(ENDPOINTS.USERS):
              console.log('get specific user service');
              res.end('get specific user service');
              break;
            default:
              sendWrongUrlError(res);
          }
          break;
        case METHODS.POST:
          if (path === ENDPOINTS.USERS) {
            console.log('creating user service');
            res.end('creating user service');
          } else {
            sendWrongUrlError(res);
          }
          break;
        case METHODS.DELETE:
          if (path.startsWith(ENDPOINTS.USERS)) {
            console.log('deleting user service');
            res.end('deleting user service');
          } else {
            sendWrongUrlError(res);
          }
          break;
        case METHODS.PUT:
          if (path.startsWith(ENDPOINTS.USERS)) {
            console.log('updating user service');
            res.end('updating user service');
          } else {
            sendWrongUrlError(res);
          }
          break;
      }
    } catch (error) {
      res.statusCode = 500;
      res.end("Oops!.. It's not you, it's me :(");
    }
  };
}
