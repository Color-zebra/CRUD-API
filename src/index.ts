import http from 'http';
import dotenv from 'dotenv';
import { Controller } from './controller/index';

dotenv.config();

class App {
  controller: Controller;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  port: string | undefined;

  constructor() {
    this.controller = new Controller();
    this.server = http.createServer(this.controller.listener);
    this.port = process.env.PORT;
  }

  start() {
    if (!this.port) {
      throw new Error('You must specify PORT on .env file before starting');
    }

    this.server.listen(this.port);
  }
}

const app = new App();

app.start();

// const server = http.createServer((req, res) => {
//   console.log(req.url);
//   res.end(`Hello from Color-zebra ${process.env.PORT}`);
// });

// server.listen(3005);
