import http from 'http';
import net from 'net';
import { UserDTO } from '../DB';
import {
  ERROR_PREFIX,
  sendInvalidDataError,
  sendWrongUrlError,
} from '../utils/errorSenders';

import errorService from '../errorService';

import { userDTOTypeGuard } from '../utils/UserDTOTypeGuard';

import { sendResultWithStatusCode } from '../utils/responseSenders';

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
    console.log('DBPort', DBPort);

    this.DBPort = DBPort;
  }

  async dispatchAction(action: Action) {
    return new Promise<string>((res, rej) => {
      const socket = new net.Socket();
      let result = '';

      socket.on('data', (data) => {
        result += data.toString();
      });
      socket.on('end', () => {
        if (result.startsWith(ERROR_PREFIX)) {
          console.log('res', result);

          rej(new Error(result.replace(ERROR_PREFIX, '')));
        } else {
          res(result);
        }
      });
      socket.on('error', (e) => {
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
    // sendResultWithStatusCode(res, '');
    try {
      const result = await this.dispatchAction({
        name: 'getAll',
      });
      sendResultWithStatusCode(res, result);
    } catch (error) {
      errorService.handleError(error, res);
    }
  }

  async getUser(res: http.ServerResponse<http.IncomingMessage>, path: string) {
    const splittedPath = path.split('/');

    if (splittedPath.length !== 4) {
      sendWrongUrlError(res);
      return;
    }

    const id = splittedPath[3];
    try {
      const result = await this.dispatchAction({
        name: 'get',
        payload: id,
      });
      sendResultWithStatusCode(res, result);
    } catch (error) {
      errorService.handleError(error, res);
    }
  }

  async addUser(res: http.ServerResponse<http.IncomingMessage>, body: string) {
    try {
      const parsedBody = JSON.parse(body);
      if (!userDTOTypeGuard(parsedBody)) {
        sendInvalidDataError(res);
        return;
      }

      const result = await this.dispatchAction({
        name: 'create',
        payload: {
          age: parsedBody.age,
          hobbies: parsedBody.hobbies,
          username: parsedBody.username,
        },
      });
      sendResultWithStatusCode(res, result, 201);
    } catch (error) {
      errorService.handleError(error, res);
    }
  }

  async deleteUser(
    res: http.ServerResponse<http.IncomingMessage>,
    path: string
  ) {
    try {
      const splittedPath = path.split('/');
      if (splittedPath.length !== 4) {
        sendWrongUrlError(res);
        return;
      }

      const id = splittedPath[3];
      await this.dispatchAction({
        name: 'delete',
        payload: id,
      });
      sendResultWithStatusCode(res, undefined, 204);
    } catch (error) {
      errorService.handleError(error, res);
    }
  }

  async updateUser(
    res: http.ServerResponse<http.IncomingMessage>,
    path: string,
    body: string
  ) {
    try {
      const parsedBody = JSON.parse(body);
      if (!userDTOTypeGuard(parsedBody)) {
        sendInvalidDataError(res);
        return;
      }

      const splittedPath = path.split('/');
      if (splittedPath.length !== 4) {
        sendWrongUrlError(res);
        return;
      }

      const id = splittedPath[3];

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
      sendResultWithStatusCode(res, result);
    } catch (error) {
      errorService.handleError(error, res);
    }
  }
}
