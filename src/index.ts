import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

const server = http.createServer((req, res) => {
  console.log(req.url);
  res.end(`Hello from Color-zebra ${process.env.PORT}`);
});

server.listen(3005);
