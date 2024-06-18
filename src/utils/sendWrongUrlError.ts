import http from 'http';
export const sendWrongUrlError = (
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.statusCode = 404;
  res.end('Looks like you made a mistake');
};
