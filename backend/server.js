require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dbConnect = require('./config/db/dbConnect');
const userRoutes = require('./routes/users/userRoutes');
const postRoutes = require('./routes/posts/postRoutes');
const commentRoutes = require('./routes/comments/commentRoutes');
const emailRoutes = require('./routes/emails/emailRoutes');
const categoryRoutes = require('./routes/categories/categoryRoutes');
const { errorHandler, notFound } = require('./middlewares/error/errorHandler');

const app = express();

// DB
dbConnect();

// Middlewares
app.use(express.json());
app.use(logger('dev'));
if (process.env.NODE_ENV === 'development') app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/categories', categoryRoutes);

// Error Handler
app.use(notFound);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
