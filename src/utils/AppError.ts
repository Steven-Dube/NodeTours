class AppError extends Error {
  statusCode: Number;
  status: String;
  constructor(message: string, statusCode: Number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;