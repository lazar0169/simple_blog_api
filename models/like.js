const Sequelize = require('sequelize');
const connection = require('../database/connection');

const likeSchema = {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false
    },
    postId: {
        type: Sequelize.INTEGER(11),
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
};

const Like = connection.define('like', likeSchema);
module.exports = Like;