const { string, size, object } = require("superstruct");

var CreateCommentDto = object({
  content : size(string(), 1, 500)
})

module.exports = {
  CreateCommentDto,
}