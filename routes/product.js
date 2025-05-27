var express = require('express');
const { assert } = require('superstruct');
const { CreateProductDto } = require('../dtos/product.dto');
const { db } = require('../utils/db');

var router = express.Router();

/** 상품 등록 API
 * @queryParam name string 상품 제목
 * @queryParam content string 상품 내용
 * @queryParam price number 상품 가격
 * @queryParam tags array 상품 태그
 * 
 * 
 * !!상품 제목과 내용이 유효한지 검증!!
 * !!상품 등록 후 상품 정보를 저장!!
 * !!상품 등록 완료 메시지 반환!!
 */
router.post('/product', async (req, res, next) => {
  assert(req.body, CreateProductDto);
  const { name, description, price, tags } = req.body;

  const product = await db.product.create({
    data: { name, description, price, tags }
  });

  res.json(product);
});

/**
 * 상품 상세 조회 API
 * @queryParam id string 상품 ID
 * 
 * !!id와 일치하는 상품이 있는지 조회!!
 * !!상품 정보가 유효한지 검증!!
 * !!상품 상세 정보 반환!!
 */
router.get('/detail/:id', async (req, res, next) => {
  const productId = Number(req.params.id);

  const product = await db.product.findUnique({
    where: { id: productId }
  });

  res.json(product);
});

/**
 * 상품 수정 API
 * @queryParam id string 상품 ID
 * @queryParam name string 상품 제목
 * @queryParam content string 상품 내용
 * @queryParam price number 상품 가격
 * @queryParam tags array 상품 태그
 * 
 * !!id와 일치하는 상품이 있는지 조회!!
 * !!수정할 상품의 정보가 유효한지 검증!!
 * !!수정된 상품 정보를 저장!!
 */

router.patch('/update/:id', async (req, res, next) => {
  const productId = Number(req.params.id);
  const { name, description, price, tags } = req.body;
  const product = await db.product.update({
    where: { id: productId },
    data: { name, description, price, tags, updatedAt: new Date() }
  });
  res.json(product);
});

/**
 * 상품 삭제 API
 * @queryParam id string 상품 ID
 * 
 * !!id와 일치하는 상품이 있는지 조회!!
 * !!상품이 존재하는지 검증!!
 * 
 */
router.delete('/delete/:id', async (req, res, next) => {
  const productId = Number(req.params.id);
  res.send(productId)
  const product = await db.product.delete({
    where: { id: productId }
  });
  res.json({ message: '상품이 삭제되었습니다.', product });
});

/**
 * 상품 목록 조회 API
 * @queryParam page number 페이지 번호
 * @queryParam limit number 페이지당 항목 수
 * 
 * !!페이지 번호와 항목 수가 유효한지 검증!!
 * !!상품 목록을 조회하고 반환!!
 * !!상품 목록이 비어있을 경우 빈 배열 반환!!
 * !!상품 목록이 존재할 경우 상품 정보 반환!!
 */
router.get('/product', async (req, res, next) => {
  const queryParam = req.query;

  const offset = parseInt(queryParam.page) || 0;
  const limit = parseInt(queryParam.limit) || 10;
  const order = queryParam.order || 'recent';
  const search = queryParam.search || '';

  let where =
    search
      ? { OR: [{ name: { contains: search }, description: { contains: search } }] }
      : {};

  const products = await db.product.findMany({
    where,
    orderBy: order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' },
    skip: offset,
    take: limit
  });

  res.json(products);
});

module.exports = router;
