const express = require('express');
const UserControllers = require('../controllers/user');
const router = express.Router();
router.post('/signUp', UserControllers.postUserSignUp);
router.post('/login', UserControllers.postUserLogin);
module.exports = router;