const express = require('express');
const { register } = require('../controllers/auth');

const router = express.Router();

//Add routes
router.post('/register', register)

module.exports = router;