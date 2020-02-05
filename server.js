const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();
require('./database/connection')

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
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.sendStatus(403);
    const validPassword = await bcrypt.compare(password, user.dataValues.password);
    if (!validPassword) return res.sendStatus(403);

    jwt.sign({ email }, process.env.SECRET_KEY, (err, token) => {
        const resUserData = {
            user: {
                username: user.dataValues.username,
                email: user.dataValues.email,
                id: user.dataValues.id,
            },
            token
        }
        res.json(resUserData);
    });
});

app.post('/register', async (req, res) => {
    let { username, password, email } = req.body;
    console.log('RECEIVED: ', { username, password, email });
    const userExists = await User.findOne({ where: { username } });
    const emailExists = await User.findOne({ where: { email } });
    if (userExists || emailExists) return res.sendStatus(409);
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    console.log('CREATING USER...');
    const user = await User.create({ username, password, email }).catch(errHandler);
    res.sendStatus(201);
});

const errHandler = err => {
    console.error("Error: ", err);
};