require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const dbConnect = require('./config/db/dbConnect');
const usersRoutes = require('./routes/users/usersRoutes');
const { errorHandler, notFound } = require('./middlewares/error/errorHandler');

const app = express();

// DB
dbConnect();

// Middlewares
app.use(express.json());
app.use(logger('dev'));

// User Routes
app.use('/api/users', usersRoutes);

// Error Handler
app.use(notFound);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
