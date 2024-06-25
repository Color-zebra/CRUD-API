import cluster from 'cluster';
import http from 'http';
import { parseBody } from '../utils/bodyParser';

export class Balancer {
  workers: Array<typeof cluster.worker>;
  port: number;
  currWorkerIndex: number;

  constructor(workers: Array<typeof cluster.worker>, port: number) {
    this.workers = workers;
    this.port = port;
    this.currWorkerIndex = 0;
    this.start();
  }

  getCurrWorkerPortByRoundRobin() {
    const portForUse = ++this.currWorkerIndex + this.port;

    if (this.currWorkerIndex === this.workers.length) {
      this.currWorkerIndex = 0;
    }

    console.log(portForUse);

    return portForUse;
  }

  start() {
    const server = http.createServer(async (req, res) => {
      const { url, headers, method } = req;

      const reqToWorker = http.request(
        {
          hostname: 'localhost',
          port: this.getCurrWorkerPortByRoundRobin(),
          path: url,
          method,
          headers,
        },
        (workerRes) => {
          const code = workerRes.statusCode;
          const headers = workerRes.headers;
          res.writeHead(code, headers);
          workerRes.pipe(res);
        }
      );

      if (method === 'POST') {
        const body = await parseBody(req);
        reqToWorker.write(body);
      }

      reqToWorker.end();
    });

    server.listen(this.port, () => {
      console.log('Balancing starts on', this.port);
    });
  }
}
