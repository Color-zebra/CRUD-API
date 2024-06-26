import http from 'http';

export const sendWrongUrlError = (
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.statusCode = 404;
  res.end('Looks like you made a mistake');
};

export const sendServerError = (
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.statusCode = 500;
  res.end("Oops!.. It's not you, it's me :(");
};
