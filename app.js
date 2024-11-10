import express from 'express';
import { logger } from './middlewares/logger.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as path from 'path';

// import routers
import storyRoutes from './routes/stories.js';
import demandRoutes from './routes/demands.js';
import otherRoutes from './routes/others.js';

dotenv.config();

const dbURI = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT;

mongoose.connect(dbURI)
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error));

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));
app.use(logger);
app.use('/assets', express.static('public'));

//Home route
app.get('/', (request, response) => {
  response.redirect('/stories');
});

// Use router
app.use('/stories', storyRoutes);
app.use('/demands', demandRoutes)
app.use('/', otherRoutes)

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`);
});