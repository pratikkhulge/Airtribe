const express = require('express');
const leadService = require('./leadService');
const router = express.Router();

router.post('/', leadService.registerLead);
router.put('/:identifier', leadService.updateLead);
router.get('/search', leadService.searchLeads);
router.get('/all', leadService.getAllLeads);

module.exports = router;
