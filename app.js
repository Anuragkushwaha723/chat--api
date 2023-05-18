const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const userModel = require('./models/user');
const UserRoutes = require('./routes/user');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
}));
app.use(bodyParser.json({ extended: false }));
app.use('/user', UserRoutes);
sequelize.sync()
    .then((res) => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
