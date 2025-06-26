const { string } = require("superstruct");

var CreateUserDto = {
  email: string(),
  nickname: string(),
  image: string(),
  password: string(),
}

module.exports = { CreateUserDto };