const express = require('express');
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const router = express.Router({mergeParams:true});

// Add routes
router.route('/').get(getCourses).post(createCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router;

