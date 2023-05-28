const express = require('express');
const authenticateRoutes = require('../middlewares/auth');
const groupControllers = require('../controllers/group');
const router = express.Router();
router.post('/create-group', authenticateRoutes.authenticate, groupControllers.postGroupData);
router.get('/get-all-group', authenticateRoutes.authenticate, groupControllers.getGroupData);
module.exports = router;