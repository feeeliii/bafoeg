import express, { request, response } from 'express'
import { logger } from './middlewares/logger.js'

import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const PORT = 3000

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));

app.use(logger)
app.use('/assets', express.static('public'))

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})

//new

//object for experiences and demands

const experiences = [
    {id: 1, content: 'bla', author: 'Heiz Heinzel', date: '01.01.2024'},
    {id: 2, content: 'bla', author: 'Berta Bertanius', date: '02.02.2024'}
]

const demands = [
    {id: 1, content: 'bla', author: 'Heiz Heinzel', date: '01.01.2024'},
    {id: 2, content: 'bla', author: 'Berta Bertanius', date: '02.02.2024'}
]

//routes

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public', 'mainpage.html'));;
})

app.post('/stories', (request, response) => {
  console.log('Contact form submission: ', request.body);
  response.send('Thank you for your message. We will be in touch soon.');
});

app.get('/stories/:id', (request, response) => {
    const storyId = parseInt(request.params.id, 10);
    const story = experiences.find(exp => exp.id === storyId);
    if (story) {
        response.json(story);
    } else {
        response.status(404).send('Geschichte nicht gefunden, sorry :(')
    }
})

app.get('/demands', (request, response) => {
  //console.log(request.query) Query string try out
  response.send('Liste aller Forderungen:');
  });

app.get('/demands/:id', (request, response) => {
    const demandId = parseInt(request.params.id, 10);
    const demand = demands.find(dem => dem.id === demandId);
    if (demand) {
      response.json(demand);
    } else {
      response.status(404).send('Forderung nicht gefunden, sorry :(');
    }
  });

app.get('/project', (request, response) => {
    response.send('Über das Projekt');
});

app.get('/privacy', (request, response) => {
    response.send('Datenschutz');
});

