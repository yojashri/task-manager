const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require("express-rate-limit");

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    message: { success: false, message: "Too many login attempts, try later." }
});

app.use("/auth/login", loginLimiter);

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use(errorHandler);

module.exports = app;
