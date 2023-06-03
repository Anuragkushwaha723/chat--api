const express = require('express');
const upload = require('express-fileupload');
const authenticateRoutes = require('../middlewares/auth');
const ChatsControllers = require('../controllers/chats');
const router = express.Router();
router.post('/saveMessage', authenticateRoutes.authenticate, ChatsControllers.postChatMessages);
router.post('/saveFiles', authenticateRoutes.authenticate, upload(), ChatsControllers.postChatFiles);
router.get('/getMessage', authenticateRoutes.authenticate, ChatsControllers.getChatMessages);
module.exports = router;