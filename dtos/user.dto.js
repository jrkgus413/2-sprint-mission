const { string, optional, object } = require("superstruct");

var CreateUserDto = object({
  email: string(),
  nickname: string(),
  image: optional(string()),
  password: string(),
})

module.exports = {
  CreateUserDto
};