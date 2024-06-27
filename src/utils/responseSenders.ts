import http from 'http';

export const sendResultWithStatusCode = (
  res: http.ServerResponse<http.IncomingMessage>,
  payload?: string,
  code: number = 200
) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(payload);
};
