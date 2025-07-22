/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users SET nickname = 'test' WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT * FROM products 
WHERE user_id = 1 
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
*/
SELECT COUNT(*) FROM products 
WHERE user_id = 1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT * FROM products
JOIN likes ON likes.likeable_type = 'product' AND likes.likeable_id = products.id
WHERE likes.user_id = 1
ORDER BY products.created_at DESC
LIMIT 10 OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
*/
SELECT COUNT(*) FROM products
JOIN likes ON likes.likeable_type = 'product' AND likes.likeable_id = products.id
WHERE likes.user_id = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products (name, price, description, user_id, category_id) VALUES (
	'computer', 200000, '최신형 pc 판매', 1, 1
);

/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT 
	products.id, 
	products.name, 
	products.price, 
	products.description, 
	products.user_id, 
	products.category_id, 
	products.created_at, 
	COUNT(likes.id) AS like_count 
FROM products
LEFT JOIN likes ON likes.likeable_type = 'product' AND likes.likeable_id = products.id
WHERE products.name like '%test%' OR products.description like '%test%'
GROUP BY products.id
ORDER BY products.created_at DESC
LIMIT 10;

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT * FROM products
WHERE products.id = 1;

/*
  9. 상품 수정
  - 1번 상품 수정
*/
UPDATE products SET price = 15000
WHERE id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO likes(user_id, likeable_type, likeable_id) VALUES (
	1, 'product', 2
);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM likes WHERE user_id = 1 AND likeable_type = 'product' AND likeable_id = 2;

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO comments(user_id, commentable_type, commentable_id, content) VALUES (
	1, 'product', 2, '사용 기간 확인해주세요'
);

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/
SELECT * FROM comments
WHERE created_at < '2025-03-25' AND commentable_type = 'product' AND commentable_id = 1
ORDER BY created_at DESC, id DESC
LIMIT 10;
