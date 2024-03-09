const express = require('express');
const router = express.Router();
const commentController = require('./commentController');

router.use('/', commentController);

module.exports = router;
