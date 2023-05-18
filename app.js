const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const userModel = require('./models/user');
const UserRoutes = require('./routes/user');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use('/user', UserRoutes);
sequelize.sync()
    .then((res) => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
