class AppError extends Error {
  constructor(statusCode, message, errors = undefined) {
    super(message);
    this.statusCode = statusCode;
    if (errors) {
      this.errors = errors;
    }
  }
}

export default AppError;
