const express = require('express');
const authenticateRoutes = require('../middlewares/auth');
const ChatsControllers = require('../controllers/chats');
const router = express.Router();
router.post('/saveMessage', authenticateRoutes.authenticate, ChatsControllers.postChatMessages);
module.exports = router;