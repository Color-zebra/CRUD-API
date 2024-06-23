import http from 'http';
import dotenv from 'dotenv';
import { Controller } from './controller/index';
import { Balancer } from './balancer/index';
import cluster from 'cluster';
import os from 'os';
import { Operations, Repository } from './repository';

dotenv.config();

class App {
  controller: Controller;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  port: number;
  isMulti: boolean;
  balancer: Balancer;
  isMain: boolean;
  repository: Repository;

  constructor() {
    this.parseEnv();
    this.controller = new Controller();
    this.server = http.createServer(this.controller.listener);
  }

  start() {
    if (this.isMulti) {
      this.startMulti();
    } else {
      this.server.listen(this.port);
    }
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
  }

  startMulti() {
    if (cluster.isPrimary) {
      this.repository = new Repository();
      const workers: Array<typeof cluster.worker> = [];

      for (let i = 0; i < os.cpus().length; i++) {
        const newWorker = cluster.fork({ PORT: this.port + i + 1 });
        newWorker.on('message', async (msg) => {
          console.log(msg.cmd);
          // @ts-expect-error asdasd
          const res = this.repository[msg.cmd as Operations](msg.payload);
          newWorker.send(await res);
        });
        workers.push(newWorker);
      }

      this.balancer = new Balancer(workers, this.port);
    }

    if (cluster.isWorker) {
      this.server.listen(this.port, () => {
        console.log(
          'Child server starting on port',
          this.port,
          'and with PID',
          process.pid
        );
      });
    }
  }
}

const app = new App();

app.start();
