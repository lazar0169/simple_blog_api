const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Like = require('../models/like');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Creating the post
router.post(/*posts*/'/', extractToken, (req, res) => {
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

// Creating comment for the post
router.post(/*posts*/'/comment', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const { body, userId, postId } = req.body;
            console.log(req.body);
            await Comment.create({ body, userId, postId }).catch(errHandler);
            res.sendStatus(200);
        }
    });
});

// Creating like for the post
router.post(/*posts*/'/like', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const { userId, postId } = req.body;
            const likeExist = await Like.findOne({ where: { userId, postId } });
            try {
                if (likeExist) {
                    await likeExist.destroy().catch(errHandler);
                } else {
                    await Like.create({ userId, postId }).catch(errHandler);
                }
                res.sendStatus(200);
            } catch (error) {
                res.sendStatus(400).json({ error: 'Failed to like/dislike the post' });
            }
        }
    });
});

// Editing the post
router.post(/*posts*/'/:id', extractToken, (req, res) => {
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
router.get(/*posts*/'/', async (req, res) => {
    let posts = await Post.findAll();
    for (let post of posts) {
        post = post.dataValues;
        const comments = await Comment.findAll({ where: { postId: post.id } });
        const tmpComments = comments.map(async (comment) => {
            const reqUser = await User.findOne({ where: { id: comment.dataValues.userId } });
            const user = reqUser.dataValues.username;
            const { id, body, createdAt, updatedAt } = comment.dataValues;
            return { id, body, user, createdAt, updatedAt };
        });
        post.comments = await Promise.all(tmpComments);
        const likes = await Like.findAll({ where: { postId: post.id } });
        const tmpLikes = likes.map(like => like.dataValues.userId);
        post.likes = tmpLikes;
    }
    res.json(posts);
});



// Retriving the post
router.get(/*posts*/'/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        res.json(post.dataValues);
    } catch (error) {
        console.log(error);
        res.sendStatus(404).json('Post does not exist');
    }
});

// Removal of the post
router.delete(/*posts*/'/:id/:user', extractToken, (req, res) => {
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