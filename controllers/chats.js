const Messages = require('../models/messages');
const User = require('../models/user');
exports.postChatMessages = async (req, res, next) => {
    try {
        const { messages } = req.body;
        if (!messages) {
            return res.status(500).json({ message: 'Sending empty messages are not allowed' });
        }
        await req.user.createMessage({ messages: messages });
        return res.status(201).json({ messages: 'Successfully updated the message in database' });
    } catch (error) {
        res.status(403).json({ message: 'Something went wrong' });
    }
}
exports.getChatMessages = async (req, res, next) => {
    try {
        let promise1 = Messages.findAll({
            attributes: ['messages', 'id'],
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ]
        });
        let promise2 = User.findAll({ attributes: ['name'] });
        let [data, users] = await Promise.all([promise1, promise2]);
        return res.status(201).json({ messages: data, users: users });
    } catch (error) {
        res.status(403).json({ message: 'Something went wrong' });
    }
}