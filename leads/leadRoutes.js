const express = require('express');
const router = express.Router();
const leadController = require('./leadController');

router.use('/', leadController);

module.exports = router;
