const express = require('express');
const router = express.Router();
const courseController = require('./courseController');

router.use('/', courseController);

module.exports = router;
