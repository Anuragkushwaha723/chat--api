const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
exports.postUserSignUp = async (req, res, next) => {
    try {
        let { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
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
                await User.create({ name, email, password: hash, phone });
                return res.status(201).json({ message: 'Successfully signed up' })
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, `${process.env.TOKEN_SECRET}`);
}
exports.postUserLogin = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(501).json({ message: 'Some data is missing' });
        }
        let data = await User.findAll({ where: { email: email } });
        if (data.length > 0) {
            bcrypt.compare(password, data[0].password, async (err, result) => {
                if (err) {
                    res.status(403).json({ message: 'Something went wrong' });
                }

                if (result === true) {
                    res.status(201).json({ message: 'User logged in successfully', token: generateAccessToken(data[0].id, data[0].name) });
                } else {
                    res.status(401).json({ message: 'User not authorized' });
                }

            })
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}