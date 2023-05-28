const Groups = require('../models/group');
const UserGroups = require('../models/userGroup');
const sequelize = require('../utils/database');
exports.postGroupData = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        let name = req.body.groupName;
        let data1 = await Groups.create({ name }, { transaction: t });
        req.user.addGroups(data1, { through: { admin: true } }, { transaction: t });
        t.commit();
        res.status(201).json({ succes: true });
    } catch (error) {
        t.rollback();
        res.status(403).json({ message: 'Something went wrong' });
    }
}
exports.getGroupData = async (req, res, next) => {
    try {
        let data1 = await req.user.getGroups();
        let data2 = [];
        for (let i = 0; i < data1.length; i++) {
            data2.push({ id: data1[i].id, name: data1[i].name, admin: data1[i].usergroups.admin });
        }
        return res.status(201).json(data2);
    } catch (error) {
        return res.status(403).json({ message: 'Something went wrong' });
    }
}