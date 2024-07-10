import http from 'http';
import {
  ERROR_MESSAGES,
  checkIsJSONError,
  sendNoUserError,
  sendServerError,
  sendUUIDError,
  sendWrongInputError,
} from '../utils/errorSenders';

class ErrorService {
  constructor() {}
  handleError(error: unknown, res: http.ServerResponse<http.IncomingMessage>) {
    if (checkIsJSONError(error)) {
      sendWrongInputError(res);
    } else if (error instanceof Error) {
      switch (error.message) {
        case ERROR_MESSAGES.UUID:
          sendUUIDError(res);
          break;
        case ERROR_MESSAGES.NO_USER:
          sendNoUserError(res);
          break;
        default:
          sendServerError(res);
      }
    } else {
      sendServerError(res);
    }
  }
}

export default new ErrorService();
