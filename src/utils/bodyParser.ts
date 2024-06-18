import http from 'http';

export const parseBody = (req: http.IncomingMessage) => {
  const parsedBodyPromise: Promise<string> = new Promise((res, rej) => {
    let result = '';
    req.on('data', (chunk) => {
      result += chunk;
    });

    req.on('end', () => {
      res(result);
    });

    req.on('error', (e) => {
      rej(e);
    });
  });

  return parsedBodyPromise;
};
