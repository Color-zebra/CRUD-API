import http from 'http';
import net from 'net';
import { UserDTO } from '../DB';
import { sendServerError } from '../utils/errorSenders';

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

export class UserService {
  DBPort: number;
  constructor(DBPort: number) {
    this.DBPort = DBPort;
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
        console.log(e);
        rej(e);
      });

      socket.connect(
        {
          port: this.DBPort,
          host: 'localhost',
        },
        () => {
          socket.write(JSON.stringify(action));
        }
      );
    });
  }

  async getAllUsers(res: http.ServerResponse<http.IncomingMessage>) {
    const result = await this.dispatchAction({
      name: 'getAll',
    });
    res.setHeader('Content-Type', 'application/json');
    res.end(result);
  }

  async getUser(res: http.ServerResponse<http.IncomingMessage>, path: string) {
    const id = path.split('/')[3];
    const result = await this.dispatchAction({
      name: 'get',
      payload: id,
    });
    res.setHeader('Content-Type', 'application/json');
    res.end(result);
  }

  async addUser(res: http.ServerResponse<http.IncomingMessage>, body: string) {
    try {
      const parsedBody = JSON.parse(body) as UserDTO;
      const result = await this.dispatchAction({
        name: 'create',
        payload: {
          age: parsedBody.age,
          hobbies: parsedBody.hobbies,
          username: parsedBody.username,
        },
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(result);
    } catch (error) {
      sendServerError(res);
    }
  }

  async deleteUser(
    res: http.ServerResponse<http.IncomingMessage>,
    path: string
  ) {
    const id = path.split('/')[3];
    const result = await this.dispatchAction({
      name: 'delete',
      payload: id,
    });
    if (result === 'true') {
      res.statusCode = 204;
    } else if (result === 'No user') {
      res.statusCode = 404;
      res.statusMessage = 'There is no such user';
    }
    res.setHeader('Content-Type', 'application/json');
    res.end();
  }

  async updateUser(
    res: http.ServerResponse<http.IncomingMessage>,
    path: string,
    body: string
  ) {
    try {
      const parsedBody = JSON.parse(body) as UserDTO;
      const id = path.split('/')[3];
      console.log(parsedBody, id);

      const result = await this.dispatchAction({
        name: 'update',
        payload: {
          id: id,
          user: {
            age: parsedBody.age,
            hobbies: parsedBody.hobbies,
            username: parsedBody.username,
          },
        },
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(result);
    } catch (error) {
      sendServerError(res);
    }
  }
}
