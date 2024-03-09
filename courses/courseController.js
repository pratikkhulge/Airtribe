const express = require('express');
const courseService = require('./courseService');
const router = express.Router();

router.post('/', courseService.createCourse);
router.put('/:identifier', courseService.updateCourse);
router.get('/all', courseService.getAllCourses);

module.exports = router;
