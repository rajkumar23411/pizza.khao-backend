class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.message = message;
    this.status = status;
  }

  static AlreadyExists(message) {
    return new CustomErrorHandler(400, message);
  }

  static notFound(message) {
    return new CustomErrorHandler(404, message);
  }

  static unAuthorized(message) {
    return new CustomErrorHandler(401, message);
  }
}

module.exports = CustomErrorHandler;
