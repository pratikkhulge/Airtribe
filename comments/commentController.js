const express = require('express');
const commentService = require('./commentService');
const router = express.Router();

router.post('/', commentService.addComment);
router.get('/all', commentService.getAllComments);

module.exports = router;
