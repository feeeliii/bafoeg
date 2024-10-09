import express, { request, response } from 'express'

const app = express()
const PORT = 3000

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})

//new

app.get('/', (request, response) => {
    response.send('Liste aller Bafög Geschichten');
});

app.get('/stories/:id', (request, response) => {
    const storyId = parseInt(request.params.id, 10);
    response.send(`Details zu Geschichte ${storyId}`);
});

app.get('/demands', (request, response) => {
  response.send('Liste aller Forderungen:');
});

app.get('/demands/:id', (request, response) => {
  const demandId = parseInt(request.params.id, 10);
  response.send(`Details zur Forderung mit ID: ${demandId}`);
});

app.get('/project', (request, response) => {
    response.send('Über das Projekt');
});

app.get('/privacy', (request, response) => {
    response.send('Datenschutz');
});