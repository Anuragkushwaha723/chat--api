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
        let lstUsrId, lstChtId;

        if (req.query.lstUsrId == "undefined") {
            lstUsrId = 1;
        } else {
            lstUsrId = + req.query.lstUsrId + 1;
        }

        if (req.query.lstChtId == "undefined") {
            lstChtId = 1;
        } else {
            lstChtId = + req.query.lstChtId + 1;
        }

        let promise1 = Messages.findAll({
            offset: lstChtId - 1,
            attributes: ['messages', 'id'],
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ]
        });
        let promise2 = User.findAll({ offset: lstUsrId - 1, attributes: ['name', 'id'] });
        let [data, users] = await Promise.all([promise1, promise2]);
        return res.status(201).json({ messages: data, users: users });
    } catch (error) {
        res.status(403).json({ message: 'Something went wrong' });
    }
}