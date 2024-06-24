import net from 'net';

export class Repository {
  port: number;
  netServer: net.Server;

  constructor(port: number) {
    this.port = port;
  }

  async init() {
    return new Promise((res) => {
      console.log('starting...');

      this.netServer = net.createServer((socket) => {
        socket.on('data', (data) => {
          console.log('data', JSON.parse(data.toString()));
          socket.end('Succ created');
        });
      });

      this.netServer.listen(this.port, () => {
        res(this.netServer);
        console.log('in memory db server starts on', this.port);
      });
    });
  }

  getDBPort() {
    return this.port;
  }
}
