const express = require('express');
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampInRadius,
	bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');
//Include other resource routers
const courseRouter = require('./courses')

const {protect}=require('../middleware/auth')

const router = express.Router();

//Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter)

// Add routes
router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router
	.route('/')
	.get(advancedResults(Bootcamp,'courses'),getBootcamps)
	.post(protect,createBootcamp);

router
	.route('/:id')
	.get(getBootcamp)
	.put(protect,updateBootcamp)
	.delete(protect,deleteBootcamp);

router.route('/:id/photo').put(protect,bootcampPhotoUpload);

module.exports = router;
