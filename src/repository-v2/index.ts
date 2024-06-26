import net from 'net';
import { DB, User, UserDTO } from '../DB';
import { Action } from '../userService';
import { v4 as uuidv4, validate } from 'uuid';

export class Repository {
  port: number;
  netServer: net.Server;
  DB: User[];

  constructor(port: number) {
    this.port = port;
    this.DB = DB;
  }

  async init() {
    return new Promise((res) => {
      this.netServer = net.createServer((socket) => {
        socket.on('data', async (data) => {
          try {
            const action = JSON.parse(data.toString());
            const result = await this.handleAction(action);
            socket.end(JSON.stringify(result));
          } catch (error) {
            console.log(error.message);

            socket.end(error.message);
          }
        });
      });

      this.netServer.listen(this.port, () => {
        res(this.netServer);
      });
    });
  }

  handleAction(action: Action) {
    switch (action.name) {
      case 'create':
        return this.createUser(action.payload);
      case 'delete':
        return this.deleteUser(action.payload);
      case 'get':
        return this.getUser(action.payload);
      case 'getAll':
        return this.getAllUsers();
      case 'update':
        return this.updateUser(action.payload.id, action.payload.user);
      default:
        throw new Error('Incorrect action');
    }
  }

  checkId(id: string) {
    if (!validate(id)) {
      throw new Error('Invalid user ID');
    }
  }

  async createUser(user: UserDTO) {
    this.DB.push({ ...user, id: uuidv4() });
    return user;
  }

  async deleteUser(userId: string) {
    this.checkId(userId);
    if (this.DB.some(({ id }) => userId === id)) {
      this.DB = this.DB.filter(({ id }) => id !== userId);
      return true;
    } else {
      throw new Error('No user');
    }
  }

  async getUser(userId: string) {
    this.checkId(userId);
    console.log(this.DB);

    const user = this.DB.find(({ id }) => id === userId);

    if (user) {
      return user;
    } else {
      throw new Error('No user');
    }
  }

  async getAllUsers() {
    return this.DB;
  }

  async updateUser(userId: string, user: UserDTO) {
    this.checkId(userId);
    const currUserIndex = this.DB.findIndex(({ id }) => id === userId);

    if (currUserIndex !== -1) {
      this.DB[currUserIndex] = { ...this.DB[currUserIndex], ...user };
      console.log(this.DB);

      return DB[currUserIndex];
    } else {
      throw new Error('No user');
    }
  }

  getDBPort() {
    return this.port;
  }
}
