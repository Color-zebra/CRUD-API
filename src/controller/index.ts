import http from 'http';
import { parseBody } from '../utils/bodyParser';
import { parseURL } from '../utils/urlParser';
import { sendWrongUrlError } from '../utils/sendWrongUrlError';
import { Operations, Repository } from '../repository/index';

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
  repository: Repository;
  constructor() {
    this.repository = new Repository();
  }

  listener = async (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
  ) => {
    try {
      const { url, method } = req;
      const body = method === 'POST' ? await parseBody(req) : null;
      const { path } = parseURL(url);
      console.log('handled by worker with PID', process.pid);

      switch (method) {
        case METHODS.GET:
          switch (true) {
            case path === ENDPOINTS.USERS: {
              console.log('get all users service');
              const result = await this.repository[Operations.READ]();
              console.log(result);

              res.end(JSON.stringify(result));
              break;
            }
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
            res.end(
              JSON.stringify(
                await this.repository[Operations.CREATE](JSON.parse(body))
              )
            );
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
