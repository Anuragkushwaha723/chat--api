const Messages = require('../models/messages');
exports.postChatMessages = async (req, res, next) => {
    try {
        const { messages } = req.body;
        if (!messages) {
            return res.status(500).json({ message: 'Sending empty messages are not allowed' });
        }
        let data = await req.user.createMessage({ messages: messages });
        return res.status(201).json(data);
    } catch (error) {
        res.status(403).json({ message: 'Something went wrong' });
    }
}