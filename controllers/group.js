const Groups = require('../models/group');
const User = require('../models/user');
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
exports.postAddUserInGroup = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        let phone = req.body.phoneNo;
        let id = req.query.gid;
        if (!phone) {
            return res.status(403).json({ message: 'Data is missing' });
        }
        let data1 = await req.user.getGroups({ where: { id: id } });
        if (data1[0].usergroups.admin === true) {
            let data2 = await User.findAll({ where: { phone: phone } });
            if (data2.length > 0) {
                await data2[0].addGroups(data1, { through: { admin: false } }, { transaction: t });
                t.commit();
                return res.status(201).json({ message: 'success' });

            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    } catch (error) {
        t.rollback();
        return res.status(403).json({ message: 'Something went wrong' });
    }
}
exports.getAllUserInGroup = async (req, res, next) => {
    try {
        let id = req.query.gid;
        let data1 = await req.user.getGroups({ where: { id: id } });
        if (data1.length > 0) {
            let data2 = await data1[0].getUsers();
            if (data2.length > 0) {
                let data3 = [];
                for (let i = 0; i < data2.length; i++) {
                    data3.push({ id: data2[i].id, name: data2[i].name, admin: data2[i].usergroups.admin });
                }
                return res.status(201).json(data3);
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    } catch (error) {
        return res.status(403).json({ message: 'Something went wrong' });
    }
}

exports.getDeleteUsersInGroup = async (req, res, next) => {
    try {
        let id = req.query.gid;
        let uId = req.query.uId;
        let data1 = await req.user.getGroups({ where: { id: id } });
        if (data1[0].usergroups.admin === true) {
            let data2 = await data1[0].getUsers({ where: { id: uId } });
            if (data2.length > 0) {
                if (data2[0].usergroups.admin === false) {
                    await data2[0].usergroups.destroy();
                    return res.status(201).json({ message: 'success' });
                } else {
                    throw new Error();
                }
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    } catch (error) {
        return res.status(403).json({ message: 'Something went wrong' });
    }
}

exports.getCreateAdminOfUsersInGroup = async (req, res, next) => {
    try {
        let id = req.query.gid;
        let uId = req.query.uId;
        let data1 = await req.user.getGroups({ where: { id: id } });
        if (data1[0].usergroups.admin === true) {
            let data2 = await data1[0].getUsers({ where: { id: uId } });
            if (data2.length > 0) {
                data2[0].usergroups.admin = true;
                await data2[0].usergroups.save();
                return res.status(201).json({ message: 'success' });
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    } catch (error) {
        return res.status(403).json({ message: 'Something went wrong' });
    }
}