import express, { request, response } from 'express'
import { logger } from './middlewares/logger.js'
import mongoose from 'mongoose';

import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES module scope
/* const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); */

const app = express()
const PORT = 3000

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

app.set('view engine', 'ejs')

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));

app.use(logger)
app.use('/assets', express.static('public'))

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})

//new

//object for stories and demands - for testing before database

const stories = [
    {id: 1, content: 'bla', author: 'Heiz Heinzel', date: '01.01.2024'},
    {id: 2, content: 'bla', author: 'Berta Bertanius', date: '02.02.2024'}
]

const demands = [
    {id: 1, content: 'bla', author: 'Heiz Heinzel', date: '01.01.2024'},
    {id: 2, content: 'bla', author: 'Berta Bertanius', date: '02.02.2024'}
]

//routes

app.get('/', (request, response) => {
  response.render('stories/index', {
    nameOfPage: "Geschichten",
    toDo: "Erzähl deine Geschichte!",
    numberOfStoriesSubmitted: 100,
    formAction: "/stories",
    inputName: "story",
    inputPlaceholder: "Schreibe hier deine Geschichte"
    })
})

/* app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public', 'mainpage.html'));;
}) */

app.post('/stories', (request, response) => {
  console.log('Contact form submission: ', request.body);
  response.send('Thank you for your message. We will be in touch soon.');
});

app.get('/stories/:id', (request, response) => {
    const storyId = parseInt(request.params.id, 10);
    const story = stories.find(exp => exp.id === storyId);
    if (story) {
        response.json(story);
    } else {
        response
        .status(404)
        .send('Geschichte nicht gefunden, sorry :(')
    }
})

app.get('/demands', (request, response) => {
  response.render('demands/index', {
    nameOfPage: "Forderungen",
    toDo: "Stelle deine Forderung!",
    numberOfDemandsSubmitted: 100,
    formAction: "/demands",
    inputName: "demand",
    inputPlaceholder: "Stelle hier deine Forderung"
    })
})

app.post('/demands', (request, response) => {
  console.log('Contact form submission: ', request.body);
  response.send('Thank you for your message. We will be in touch soon.');
});

app.get('/demands/:id', (request, response) => {
    const demandId = parseInt(request.params.id, 10);
    const demand = demands.find(dem => dem.id === demandId);
    if (demand) {
      response.json(demand);
    } else {
      response
      .status(404)
      .send('Forderung nicht gefunden, sorry :(');
    }
  });

app.get('/project', (request, response) => {
    response.send('Über das Projekt');
});

app.get('/privacy', (request, response) => {
    response.send('Datenschutz');
});

