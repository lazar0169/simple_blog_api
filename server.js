const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

// Server
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
console.log('Starting server');
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

// Routes
app.use('/posts', require('./routes/post'));

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) return res.sendStatus(403);
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.sendStatus(403);

    jwt.sign({ name }, process.env.SECRET_KEY, (err, token) => {
        res.json({ user, token });
    });
});

app.post('/register', async (req, res) => {
    let { name, password } = req.body;
    const userExists = await User.findOne({ name });
    if (userExists) return res.sendStatus(400);
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const user = new User({ name, password });
    
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        console.error(err);
    }
});

// Mongoose
// console.log('Connecting to MongoDB');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
    if (err) return console.error(err);
    console.log('MongoDB connected.');
});