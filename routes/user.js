const express = require('express');
const UserControllers = require('../controllers/user');
const router = express.Router();
router.post('/signUp', UserControllers.postUserSignUp);
module.exports = router;