import express, { request, response } from 'express'

const app = express()
const PORT = 3000

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})

app.get('/', (request, response) => {
    response.send(`
        <form action="/submit-story" method="post">
            <textarea name="story"></textarea>
            <button type="submit">Geschichte einreichen</button>
        </form>
    `);
});

app.post('/submit-story', (request, response) => {
    response.send('Vielen Dank für das Einreichen der Geschichte. Nach einem kurzen Checkup wird deine Geschichte online gehen.')
})

app.get('/about', (request, response) => {
    response.send('Über das Projekt')
})

app.get('/greet', (request, response) => {
    const name = 'Besucher';
    const timeOfDay = 'Abend';
    response.send(`<p>${name}, Willkommen auf unserer Webseite.</p>`);
});




