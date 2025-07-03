const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { toggleLike } = require("../controllers/likeController");

router.route('/').post(authenticate, toggleLike);

module.exports = router;