const { object, size, string, number, array, optional } = require("superstruct");

var CreateProductDto = object({
  name: size(string(), 1, 30),
  description: size(string(), 1, 100),
  price: number(),
  tags: array(string()),
  imageUrl: optional(string()),
})

module.exports = {
  CreateProductDto,
}