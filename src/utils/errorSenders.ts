import http from 'http';

export const ERROR_PREFIX = '--ERROR--';

export const sendWrongUrlError = (
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.statusCode = 404;
  res.end("Looks like you made a mistake, it's wrong url");
};

export const sendServerError = (
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.statusCode = 500;
  res.end("Oops!.. It's not you, it's me :(");
};

export const sendUUIDError = (
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.statusCode = 400;
  res.end(ERROR_MESSAGES.UUID);
};

export const sendNoUserError = (
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.statusCode = 404;
  res.end(ERROR_MESSAGES.NO_USER);
};

export const sendWrongInputError = (
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.statusCode = 400;
  res.end(ERROR_MESSAGES.WRONG_INPUT);
};

export const sendInvalidDataError = (
  res: http.ServerResponse<http.IncomingMessage>
) => {
  res.statusCode = 400;
  res.end(ERROR_MESSAGES.INVALID_DATA);
};

export const enum ERROR_MESSAGES {
  UUID = 'Invalid user ID',
  NO_USER = 'No user',
  WRONG_INPUT = 'Incorrect JSON',
  INVALID_DATA = 'Invalid data',
}

export const checkIsJSONError = (e: unknown) => {
  if (
    e instanceof Error &&
    e.name === 'SyntaxError' &&
    (e.message.startsWith('Unexpected token') ||
      e.message.startsWith('Unexpected end of JSON'))
  ) {
    return true;
  }
  return false;
};

export const InvalidJSONErrorName = '';
