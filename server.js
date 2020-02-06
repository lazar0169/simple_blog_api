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

app.post('/password', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            let { password, userId } = req.body;
            const user = await User.findOne({ where: { id: userId } });
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            try {
                await user.update({ password }).catch(errHandler);
                res.sendStatus(200);
            } catch (error) {
                res.sendStatus(400).json({ error: 'Failed to update the post' });
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