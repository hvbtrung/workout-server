require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');

// express app
const app = express();

// middleware
app.options("*", cors());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

// routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        const port = process.env.PORT || 4000;
        app.listen(port, () => {
            console.log('Connected to DB');
            console.log(`App running on port ${port}...`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
