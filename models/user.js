const Sequelize = require("sequelize");
const connection = require('../database/connection');

const userSchema = {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(35),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(300),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
    }
};

const User = connection.define('user', userSchema);
module.exports = User;