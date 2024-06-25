import http from 'http';
import net from 'net';
import { parseBody } from '../utils/bodyParser';
import { parseURL } from '../utils/urlParser';
import { sendWrongUrlError } from '../utils/sendWrongUrlError';
import { UserDTO } from '../DB';

enum ENDPOINTS {
  USERS = '/api/users',
}

enum METHODS {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export type Action =
  | {
      name: 'getAll';
    }
  | {
      name: 'get' | 'delete';
      payload: string;
    }
  | {
      name: 'create';
      payload: UserDTO;
    }
  | {
      name: 'update';
      payload: {
        id: string;
        user: UserDTO;
      };
    };

export class Controller {
  constructor() {
    this.listener = this.listener.bind(this);
  }

  async dispatchAction(action: Action) {
    return new Promise((res, rej) => {
      const socket = new net.Socket();
      let result = '';

      socket.on('data', (data) => {
        result += data.toString();
      });
      socket.on('end', () => {
        res(result);
      });
      socket.on('error', (e) => {
        rej(e);
      });

      socket.connect(
        {
          // !TODO obtain port dynamically
          port: 3014,
          host: 'localhost',
        },
        () => {
          socket.write(JSON.stringify(action));
        }
      );
    });
  }

  async listener(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
  ) {
    res.statusCode = 404;
    res.end();
    try {
      const { url, method } = req;
      const body = method === 'POST' ? await parseBody(req) : null;
      const { path } = parseURL(url);
      console.log('handled by worker with PID', process.pid);

      switch (method) {
        case METHODS.GET:
          switch (true) {
            case path === ENDPOINTS.USERS: {
              const result = await this.dispatchAction({
                name: 'getAll',
              });

              res.write(result);
              res.setHeader('Content-Type', 'application/json');
              res.end();
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
            try {
              const parsedBody = JSON.parse(body) as UserDTO;
              // TODO body data validation

              const result = await this.dispatchAction({
                name: 'create',
                payload: {
                  age: parsedBody.age,
                  hobbies: parsedBody.hobbies,
                  username: parsedBody.username,
                },
              });
              console.log('write head');

              res.statusCode = 400;
              res.end(result);
            } catch (error) {
              res.statusCode = 500;
              res.end('BOOM!');
            }
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
  }
}
