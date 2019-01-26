// Handle asynchronous middleware and wrap them in a try/catch block
module.exports = function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    }
    catch(err) {
      return next(err);
    }
  }
}