import http from 'http';
import dotenv from 'dotenv';
import { Controller } from './controller/index';
import { Balancer } from './balancer/index';
import cluster from 'cluster';
import os from 'os';
import { Repository as RepositoryV2 } from './repository-v2';

dotenv.config();

class App {
  controller: Controller;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  port: number;
  DBPort: number;
  isMulti: boolean;
  balancer: Balancer;
  isMain: boolean;
  repositoryV2: RepositoryV2;

  constructor() {
    this.parseEnv();
  }

  async start() {
    if (this.isMulti) {
      await this.startMulti();
    } else {
      await this.initDB();
      this.initServer();
    }
  }

  initServer() {
    this.controller = new Controller(this.DBPort);
    this.server = http.createServer(this.controller.listener);
    this.server.listen(this.port, () => {
      console.log(
        'Child server starting on port',
        this.port,
        'and with PID',
        process.pid
      );
    });
  }

  async initDB() {
    try {
      this.repositoryV2 = new RepositoryV2(this.port + os.cpus().length + 1);
      await this.repositoryV2.init();
      this.DBPort = this.repositoryV2.getDBPort();
    } catch (error) {
      console.log(error);
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

  async startMulti() {
    if (cluster.isPrimary) {
      await this.initDB();

      const workers: Array<typeof cluster.worker> = [];
      for (let i = 0; i < os.cpus().length; i++) {
        const newWorker = cluster.fork({
          PORT: this.port + i + 1,
          DBPort: this.DBPort,
        });
        workers.push(newWorker);
      }

      this.balancer = new Balancer(workers, this.port);
    }

    if (cluster.isWorker) {
      this.DBPort = +process.env.DBPort;
      this.initServer();
    }
  }
}

const app = new App();

app.start();
