const getValidatedId = (req) => {
  if (!req.validatedId) {
    throw new Error('유효하지 않은 ID 입니다.');
  }
  return req.validatedId;
};

module.exports = {
  getValidatedId,
};