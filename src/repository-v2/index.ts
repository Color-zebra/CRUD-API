import net from 'net';
import { DB, User, UserDTO } from '../DB';
import { Action } from '../controller';

export class Repository {
  port: number;
  netServer: net.Server;
  DB: User[];

  constructor(port: number) {
    this.port = port;
    this.DB = DB;
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

  async init() {
    return new Promise((res) => {
      this.netServer = net.createServer((socket) => {
        socket.on('data', async (data) => {
          const action = JSON.parse(data.toString());
          const result = await this.handleAction(action);
          socket.end(JSON.stringify(result));
        });
      });

      this.netServer.listen(this.port, () => {
        res(this.netServer);
      });
    });
  }

  async createUser(user: UserDTO) {
    // TODO generate uuid;
    console.log(user);

    DB.push({ ...user, id: 'aasd' });
    return user;
  }

  async deleteUser(userId: string) {
    if (DB.some(({ id }) => userId === id)) {
      DB.filter(({ id }) => id !== userId);
    } else {
      throw new Error('No user');
    }
  }

  async getUser(userId: string) {
    const user = DB.find(({ id }) => id === userId);

    if (user) {
      return user;
    } else {
      throw new Error('No user');
    }
  }

  async getAllUsers() {
    return DB;
  }

  async updateUser(userId: string, user: UserDTO) {
    const currUserIndex = DB.findIndex(({ id }) => id === userId);

    if (currUserIndex) {
      DB[currUserIndex] = { ...DB[currUserIndex], ...user };
      return DB[currUserIndex];
    } else {
      throw new Error('No user');
    }
  }

  getDBPort() {
    return this.port;
  }
}
