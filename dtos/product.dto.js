const { object, size, string, number, array, optional } = require("superstruct");

var CreateProductDto = object({
  name: size(string(), 1, 30),
  description: size(string(), 1, 100),
  price: number(),
  tags: array(string()),
  imageUrl: optional(string()),
})

var SearchProductDto = object({
  page: number(),
  limit: number()
})

module.exports = {
  CreateProductDto,
  SearchProductDto
}