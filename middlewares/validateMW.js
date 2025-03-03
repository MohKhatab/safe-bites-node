const APIError = require("./../utils/errors/APIError");

function validationMW(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      next(new APIError(error.message, 400));
    }
  };
}

module.exports = validationMW;
