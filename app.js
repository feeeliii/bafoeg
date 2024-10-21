import express from 'express';
import { logger } from './middlewares/logger.js';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;

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
mongoose.connect('mongodb://127.0.0.1:27017/bafoeg')
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error));

app.set('view engine', 'ejs');

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use('/assets', express.static('public'));

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`);
});

// Routes

app.get('/', (request, response) => {
  response.render('stories/index', {
    nameOfPage: "Geschichten",
    toDo: "Erzähl deine Geschichte!",
    numberOfStoriesSubmitted: 100,
    formAction: "/stories",
    inputName: "story",
    inputPlaceholder: "Schreibe hier deine Geschichte"
  });
});

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

app.get('/demands', (request, response) => {
  response.render('demands/index', {
    nameOfPage: "Forderungen",
    toDo: "Stelle deine Forderung!",
    numberOfDemandsSubmitted: 100,
    formAction: "/demands",
    inputName: "demand",
    inputPlaceholder: "Stelle hier deine Forderung"
  });
});

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