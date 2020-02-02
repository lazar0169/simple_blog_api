const Post = require('./models/post');

const dummyData = [
    {
        title: 'First post',
        tags: ['first', 'test'],
        body: 'This is the body for the first post',
        user: 'test',
        userId: '000'
    },
    {
        title: 'Second post',
        tags: ['second', 'test'],
        body: 'This is the body for the second post',
        user: 'test',
        userId: '000'
    },
    {
        title: 'Third post',
        tags: ['third', 'test'],
        body: 'This is the body for the third post',
        user: 'test',
        userId: '000'
    },
    {
        title: 'Fourth  post',
        tags: ['fourth', 'test'],
        body: 'This is the body for the fourth post',
        user: 'test',
        userId: '000'
    },
    {
        title: 'Fifth post',
        tags: ['fifth', 'test'],
        body: 'This is the body for the fifth post',
        user: 'test',
        userId: '000'
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
    const { title, tags, body, user, userId } = postData;
    const createdAt = new Date();
    const post = new Post({ title, createdAt, tags, body, user, userId });

    console.log('Creating post: ', postData);
    try {
        await post.save();
        console.log('Post saved in database successfully');
    } catch (err) {
        console.error(err);
    }
}