const Sequelize = require('sequelize');
const connection = require('../database/connection');

const commentSchema = {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    body: {
        type: Sequelize.STRING(300),
        allowNull: false
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

const Comment = connection.define('comment', commentSchema);
module.exports = Comment;