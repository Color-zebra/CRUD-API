import http from 'http';
import dotenv from 'dotenv';
import { Controller } from './controller/index';
import { Balancer } from './balancer/index';

dotenv.config();

class App {
  controller: Controller;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  port: number;
  isMulti: boolean;
  balancer: Balancer;

  constructor() {
    this.parseEnv();
    this.controller = new Controller();
    this.server = http.createServer(this.controller.listener);
  }

  start() {
    this.server.listen(this.port);
  }

  parseEnv() {
    const port = Number(process.env.PORT);
    const isMulti = process.env.WORK_MODE === 'multi';

    this.isMulti = isMulti;
    if (!port) {
      throw new Error('You must specify PORT on .env file before starting');
    } else {
      this.port = port;
    }

    console.log(this.port, this.isMulti);
  }

  startMulti() {
    this.balancer = new Balancer();
  }
}

const app = new App();

app.start();
