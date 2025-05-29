const { db } = require('../utils/db');
const { handleError } = require('../utils/error');

/**
 * @description 상품을 생성하는 API
 * @route POST /products
 * 
 * @param {string} req.body.name - 상품 이름
 * @param {string} req.body.description - 상품 설명
 * @param {number} req.body.price - 상품 가격
 * @param {Array<string>} req.body.tags - 상품 태그
 * @param {string} req.body.imageUrl - 상품 이미지 URL
 */
const postProduct = async (req, res) => {
  const { name, description, price, tags, imageUrl } = req.body;

  try {
    const newProduct = await db.product.create({
      data: { name, description, price, tags, imageUrl },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * @description 상품 목록을 조회하는 API
 * @route GET /products
 * 
 * @param {number} req.query.offset - 조회 시작 위치 (기본값: 0)
 * @param {number} req.query.limit - 조회할 상품 수 (기본값: 10)
 * @param {string} req.query.order - 정렬 기준 (기본값: 'recent', 'asc' 또는 'desc')
 * @param {string} req.query.search - 검색어 (상품 이름 또는 설명에 포함된 경우)
 */
const getProduct = async (req, res) => {
  try {
    const { offset, limit, order = 'recent', search = '' } = req.query;
    const skip = parseInt(offset, 10);
    const take = parseInt(limit, 10);

    const where = search
      ? { OR: [{ name: { contains: search } }, { description: { contains: search } }] }
      : {};

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: order === 'recent' ? 'desc' : 'asc' },
      skip,
      take,
    });

    res.status(200).json({ products });
  } catch (error) {
    handleError(res, error);
  }
};

/**
  * @description 상품 ID로 특정 상품을 조회하는 API
  * @route GET /products/:id
  * 
  * @param {number} req.params.id - 조회할 상품 ID
 */
const getProductById = async (req, res) => {
  if (!req.validatedId) return;

  try {
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: '조회 상품이 존재하지 않습니다.' });
    res.status(200).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

/**
  * @description 상품 정보를 수정하는 API
  * @route PATCH /products/:id
  * 
  * @param {number} req.params.id - 수정할 상품 ID
  * @param {string} req.body.name - 상품 이름
  * @param {string} req.body.description - 상품 설명
  * @param {number} req.body.price - 상품 가격
  * @param {Array<string>} req.body.tags - 상품 태그
  * @param {string} req.body.imageUrl - 상품 이미지 URL
 */
const patchProduct = async (req, res) => {
  if (!req.validatedId) return;

  const { name, description, price, tags, imageUrl } = req.body;

  try {
    // 상품 ID로 상품 조회
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: '조회 상품이 존재하지 않습니다.' });
    // 상품이 존재할 경우 업데이트
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: { name, description, price, tags, imageUrl },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * @description 상품을 삭제하는 API
 * @route DELETE /products/:id
 * 
 * @param {number} req.params.id - 삭제할 상품 ID
 */
const deleteProduct = async (req, res) => {
  if (!req.validatedId) return;

  try {
    // 상품 ID로 상품 조회
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: '조회 상품이 존재하지 않습니다.' });
    // 상품이 존재할 경우 삭제
    await db.product.delete({ where: { id: productId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getProduct,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
};