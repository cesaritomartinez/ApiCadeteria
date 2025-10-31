const createError = (status, message) => {
  return {
    status: status,
    message: message,
  };
};

module.exports = { createError };
