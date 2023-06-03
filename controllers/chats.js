const Messages = require('../models/messages');
const User = require('../models/user');
const Sequelize = require('sequelize');
const S3Service = require('../services/S3Service');
exports.postChatMessages = async (req, res, next) => {
    try {
        const { messages } = req.body;
        let gid = req.query.gid;
        if (!messages) {
            return res.status(500).json({ message: 'Sending empty messages are not allowed' });
        }
        let data1 = await req.user.getGroups({ where: { id: gid } });
        if (data1.length > 0) {
            let groupId = data1[0].id;
            await req.user.createMessage({ messages: messages, groupId: groupId });
            return res.status(201).json({ messages: 'Successfully updated the message in database' });
        } else {
            throw new Error();
        }

    } catch (error) {
        res.status(403).json({ message: 'Something went wrong' });
    }
}
exports.postChatFiles = async (req, res, next) => {
    try {
        const uploadedFile = req.files;
        let gid = req.query.gid;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const fileUrl = await S3Service.uploadToS3(uploadedFile.file.data, uploadedFile.file.name);
        let data1 = await req.user.getGroups({ where: { id: gid } });
        if (data1.length > 0) {
            let groupId = data1[0].id;
            await req.user.createMessage({ messages: fileUrl, groupId: groupId });
            return res.status(201).json({ messages: 'Successfully updated the message in database' });
        } else {
            throw new Error();
        }

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
        let gid = req.query.gid;
        let data1 = await req.user.getGroups({ where: { id: gid } });
        if (data1.length > 0) {
            let groupId = data1[0].id;
            let { gt } = Sequelize.Op
            let promise1 = Messages.findAll({
                attributes: ['messages', 'id'],
                where: { id: { [gt]: lstChtId - 1 }, groupId: groupId },
                include: [
                    {
                        model: User,
                        attributes: ['name']
                    }
                ]
            });
            let promise2 = data1[0].getUsers({ where: { id: { [gt]: lstUsrId - 1 } }, attributes: ['name', 'id'] });
            let [data, users] = await Promise.all([promise1, promise2]);
            return res.status(201).json({ messages: data, users: users });
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(403).json({ message: 'Something went wrong' });
    }
}