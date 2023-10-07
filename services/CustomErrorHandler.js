import errorMessages from "../constants/errorMessages";

class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreadyExist = (message) => {
    return new CustomErrorHandler(409, message);
  };

  static wrongCredentials = (message = errorMessages.WRONG_CREDENTIALS) => {
    return new CustomErrorHandler(401, message);
  };

  static unAuthorized = (message = errorMessages.UNAUTHORIZED_USER) => {
    return new CustomErrorHandler(401, message);
  };

  static notFound = (message = errorMessages.NOT_FOUND) => {
    return new CustomErrorHandler(404, message);
  };
}


export default CustomErrorHandler;
