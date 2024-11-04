import express from 'express';
import { logger } from './middlewares/logger.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const dbURI = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT;

// Schemas and Models
const storySchema = new mongoose.Schema({
  userName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  sentiment: { type: String, enum: ['positive', 'negative', 'neutral'], required: true },
  demandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Demand' }
});

const Story = mongoose.model('Story', storySchema);

const demandSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' }
});

const Demand = mongoose.model('Demand', demandSchema);

// Connect to the database
/*mongoose.connect('mongodb://127.0.0.1:27017/bafoeg')
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error));*/


mongoose.connect(dbURI)
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error));

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(logger);
app.use('/assets', express.static('public'));

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`);
});

// Routes

// Home route
app.get('/', async (request, response) => {
  try {
    const stories = await Story.find({}).exec();
    response.render('stories/index', { 
      items: stories, 
      itemType: 'stories', 
      nameOfPage: 'Geschichten', 
      toDo: 'Erzähl deine Geschichte!',
      formAction: '/stories',
      inputPlaceholder: 'Schreibe hier deine Geschichte'
    });
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
});

// Create new story

app.post('/stories', async (request, response) => {
  try {
    const story = new Story({
      userName: request.body.userName,
      content: request.body.content,
      sentiment: request.body.sentiment
    });
    await story.save();
    response.send('Story created');
  } catch (error) {
    console.error(error);
    response.send('Error: Story could not be created');
  }
});

// Get all stories

app.get('/stories', async (request, response) => {
  try {
    const stories = await Story.find({}).exec();
    response.render('stories/index', { 
      items: stories, 
      itemType: 'stories', 
      nameOfPage: 'Geschichten', 
      toDo: 'Erzähl deine Geschichte!',
      formAction: '/stories',
      inputPlaceholder: 'Schreibe hier deine Geschichte'
    });
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
});

// Get a single story by ID

app.get('/stories/:id', async (request, response) => {
  try {
    const story = await Story.findById(request.params.id);
    if (story) {
      response.json(story);
    } else {
      response.status(404).send('Geschichte nicht gefunden, sorry :(');
    }
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
});

// Get all demands

app.get('/demands', async (request, response) => {
  try {
    const demands = await Demand.find({}).exec();
    response.render('demands/index', { 
      items: demands, 
      itemType: 'demands', 
      nameOfPage: 'Forderungen', 
      toDo: 'Stelle deine Forderung!',
      formAction: '/demands',
      inputPlaceholder: 'Stelle hier deine Forderung'
    });
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
});

// Create new demand

app.post('/demands', async (request, response) => {
  try {
    const demand = new Demand({
      userName: request.body.userName,
      content: request.body.content
    });
    await demand.save();
    response.send('Demand Created');
  } catch (error) {
    console.error(error);
    response.send('Error: The demand could not be created.');
  }
});

// Get single demand by ID

app.get('/demands/:id', async (request, response) => {
  try {
    const demand = await Demand.findById(request.params.id);
    if (demand) {
      response.json(demand);
    } else {
      response.status(404).send('Forderung nicht gefunden, sorry :(');
    }
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
});

app.get('/project', (request, response) => {
  response.send('Über das Projekt');
});

app.get('/privacy', (request, response) => {
  response.send('Datenschutz');
});

// Edit and delete routes

// for stories

app.get('/stories/:id/edit', async (request, response) => {
  try {
    const story = await Story.findById(request.params.id).exec();
    if (!story) throw new Error('Story not found');
    response.render('stories/edit', { 
      story: story,
      nameOfPage: 'Edit Story',
     });
  } catch (error) {
    console.error(error);
    response.status(404).send('Die Geschichte wurde leider nicht gefunden.');
  }
});

app.post('/stories/:id', async (request, response) => {
  try {
    const story = await Story.findByIdAndUpdate(
      request.params.id,
      {
        userName: request.body.userName,
        content: request.body.content
      },
      { new: true }
    );
    response.redirect(`/stories/${story._id}`);
  } catch (error) {
    console.error(error);
    response.send('Error: The story could not be updated.');
  }
});

app.get('/stories/:id/delete', async (request, response) => {
  try {
    await Story.findByIdAndDelete(request.params.id);
    response.redirect('/stories');
  } catch (error) {
    console.error(error);
    response.send('Error: No story was deleted.');
  }
});

// für demands

app.get('/demands/:id/edit', async (request, response) => {
  try {
    const demand = await Demand.findById(request.params.id).exec();
    if (!demand) throw new Error('Demand not found');
    response.render('demands/edit', { demand: demand });
  } catch (error) {
    console.error(error);
    response.status(404).send('Could not find the demand you\'re looking for.');
  }
});

app.post('/demands/:id', async (request, response) => {
  try {
    const demand = await Demand.findByIdAndUpdate(
      request.params.id,
      {
        userName: request.body.userName,
        content: request.body.content
      },
      { new: true }
    );
    response.redirect(`/demands/${demand._id}`);
  } catch (error) {
    console.error(error);
    response.send('Error: The demand could not be updated.');
  }
});

app.get('/demands/:id/delete', async (request, response) => {
  try {
    await Demand.findByIdAndDelete(request.params.id);
    response.redirect('/demands');
  } catch (error) {
    console.error(error);
    response.send('Error: No demand was deleted.');
  }
});