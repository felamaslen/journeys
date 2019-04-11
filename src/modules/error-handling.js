export function catchAsyncErrors(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

export function httpErrorHandler(config, logger) {
  return (err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (!err.statusCode) {
      logger.warn('Unhandled server error: %s', err.stack);
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode)
      .json({ err: err.message });
  };
}

export function clientError(message, code = 400) {
  const err = new Error(message);

  err.statusCode = code;

  return err;
}
