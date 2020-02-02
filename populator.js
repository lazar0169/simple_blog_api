const Post = require('./models/post');

const dummyData = [
    {
        title: 'First post',
        tags: ['first', 'test'],
        body: 'This is the body for the first post'
    },
    {
        title: 'Second post',
        tags: ['second', 'test'],
        body: 'This is the body for the second post'
    },
    {
        title: 'Third post',
        tags: ['third', 'test'],
        body: 'This is the body for the third post'
    },
    {
        title: 'Fourth  post',
        tags: ['fourth', 'test'],
        body: 'This is the body for the fourth post'
    },
    {
        title: 'Fifth post',
        tags: ['fifth', 'test'],
        body: 'This is the body for the fifth post'
    }
];

const mongoose = require('mongoose');
require('dotenv').config();

console.log('Connecting to MongoDB');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
    if (err) return console.error(err);
    console.log('MongoDB connected.');
});

for (let post of dummyData) {
    addPost(post);
}

async function addPost(postData) {
    const { title, tags, body } = postData;
    const createdAt = new Date();
    const post = new Post({ title, createdAt, tags, body });

    console.log('Creating post: ', postData);
    try {
        const savedPost = await post.save();
        console.log('Post saved in database successfully');
    } catch (err) {
        console.error(err);
    }
}