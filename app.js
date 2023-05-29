const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const userModel = require('./models/user');
const MessagesModel = require('./models/messages');
const groupModel = require('./models/group');
const userGroupModel = require('./models/userGroup');
const UserRoutes = require('./routes/user');
const ChatRoutes = require('./routes/chats');
const groupRoutes = require('./routes/group');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = express();
app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
}));
app.use(bodyParser.json({ extended: false }));
app.use('/user', UserRoutes);
app.use('/chats', ChatRoutes);
app.use('/groups', groupRoutes);
userModel.hasMany(MessagesModel);
MessagesModel.belongsTo(userModel);
groupModel.hasMany(MessagesModel);
MessagesModel.belongsTo(groupModel);
userModel.belongsToMany(groupModel, { through: userGroupModel });
groupModel.belongsToMany(userModel, { through: userGroupModel });
sequelize.sync()
    .then((res) => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
