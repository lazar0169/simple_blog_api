const Sequelize = require('sequelize');
const connection = require('../database/connection');

const postSchema = {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(300),
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    tags: {
        type: Sequelize.STRING(300),
        allowNull: false
    },
    body: {
        type: Sequelize.STRING(300),
        allowNull: false
    },
    user: {
        type: Sequelize.STRING(300),
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER(300),
        allowNull: false
    },
};

const Post = connection.define('post', postSchema);
module.exports = Post;