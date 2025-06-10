const { object, size, string } = require('superstruct');

var CreateArticleDto = object({
  title: size(string(), 1, 30),
  content: size(string(), 1, 100)
})

module.exports = {
  CreateArticleDto,
}