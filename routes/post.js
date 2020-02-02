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
            const createdAt = new Date();
            const reqUser = await User.findById(userId);
            const user = reqUser.name;
            const post = new Post({ title, createdAt, tags, body, user, userId });

            try {
                const savedPost = await post.save();
                res.json({ savedPost, authData });
            } catch (error) {
                console.error(err);
            }
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
            const createdAt = new Date();

            try {
                const updatePost = await Post.findOneAndUpdate({ _id: req.params.id, userId }, { title, createdAt, tags, body });
                res.json(updatePost);
            } catch (error) {
                console.error(err);
            }
        }
    });
});

// Retriving all posts
router.get('/', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

// Retriving the post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.json(post);
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

// Removal of the post
router.delete('/:id&:user', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.params.user });
                res.json(post);
            } catch (error) {
                console.log(error);
                res.sendStatus(404);
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

module.exports = router;