const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Creating the post
router.post('/', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const { title, tags, body, userId } = req.body;
            const reqUser = await User.findOne({ where: { id: userId } });
            const user = reqUser.dataValues.username;
            const post = await Post.create({ title, tags, body, user, userId }).catch(errHandler);
            res.json({ post: post.dataValues });
        }
    });
});

// Editing the post
router.post('/:id', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const { title, tags, body, userId } = req.body;
            const createdAt = new Date().toISOString();

            const post = await Post.findOne({ where: { id: req.params.id, userId } }).catch(errHandler);

            try {
                await post.update({ title, createdAt, tags, body });
                res.sendStatus(200);
            } catch (error) {
                res.sendStatus(400).json({ error: 'Failed to update the post' });
            }
        }
    });
});

// Retriving all posts
router.get('/', async (req, res) => {
    const posts = await Post.findAll();
    res.json(posts);
});

// Retriving the post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        res.json(post.dataValues);
    } catch (error) {
        console.log(error);
        res.sendStatus(404).json('Post does not exist');
    }
});

// Removal of the post
router.delete('/:id/:user', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                await Post.destroy({ where: { id: req.params.id, userId: req.params.user } });
                res.sendStatus(200);
            } catch (error) {
                console.log(error);
                res.sendStatus(404).json('Post does not exist');
            }
        }
    });
});

// Bearer token extraction
function extractToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader !== undefined) {
        req.token = bearerHeader.split(' ')[1];
        next();
    } else {
        res.sendStatus(403);
    }
}

const errHandler = err => {
    console.error("Error: ", err);
};

module.exports = router;