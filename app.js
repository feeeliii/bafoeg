import express from 'express';
import { logger } from './middlewares/logger.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as path from 'path';

// Import routes
import storyRoutes from './routes/stories.js';
import demandRoutes from './routes/demands.js';
import otherRoutes from './routes/others.js';
import upvoteRoutes from './routes/upvote.js';
import usersRouter from './controllers/users.js';

dotenv.config();

const dbURI = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 3000; 

mongoose.connect(dbURI)
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error));

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));
app.use(logger);
app.use('/public', express.static('public'));
app.use(express.json()); // Middleware to parse JSON requests

// Use routes
app.use('/api/users', usersRouter);
app.use('/stories', storyRoutes);
app.use('/demands', demandRoutes);
app.use('/', otherRoutes);
app.use('/', upvoteRoutes);

// Home route
app.get('/', (request, response) => {
  response.redirect('/stories');
});

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })

  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }

  next(error)
}
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`);
});