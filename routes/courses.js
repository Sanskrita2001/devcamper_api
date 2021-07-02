const express = require('express');
const { getCourses } = require('../controllers/courses');
const router = express.Router({mergeParams:true});

// Add routes
router.route('/').get(getCourses)



module.exports = router;

