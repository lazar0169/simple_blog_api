const router = require('express').Router();
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Creating the post
router.post('/', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const { title, tags, body } = req.body;
            const createdAt = new Date();
            const post = new Post({ title, createdAt, tags, body });

            try {
                const savedPost = await post.save();
                res.json({ savedPost, authData });
            } catch (error) {
                console.error(err);
            }
        }
    });

});

// Editing specific post
router.post('/:id', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const { title, tags, body } = req.body;
            const createdAt = new Date();

            try {
                const updatePost = await Post.findOneAndUpdate({ _id: req.params.id }, { title, createdAt, tags, body });
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

// Retriving specific post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.json(post);
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

router.delete('/:id', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                const post = await Post.findByIdAndDelete(req.params.id);
                console.log(post);
                res.json(post);
            } catch (error) {
                console.log(error);
                res.sendStatus(404);
            }
        }
    });
});

// Verification
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