const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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

// Mongoose
// console.log('Connecting to MongoDB');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
    if (err) return console.error(err);
    console.log('MongoDB connected.');
});