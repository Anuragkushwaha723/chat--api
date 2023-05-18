const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.postUserSignUp = async (req, res, next) => {
    try {
        let { name, email, phone, password } = req.body;
        let phoneNum = + phone;
        if (!name || !email || !phoneNum || !password) {
            return res.status(501).json({ message: 'Some data is missing' });
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({ message: 'Something went wrong' });
            }
            let data = await User.findAll({ where: { email: email } });
            if (data[0]) {
                return res.status(500).json({ message: 'User already exists,Please Login' });
            } else {
                await User.create({ name, email, password: hash, phone: phoneNum });
                return res.status(201).json({ message: 'Successfully signed up' })
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}