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
    `)
})

app.post('/submit-story', (request, response) => {
    response.send('Vielen Dank für das Einreichen der Geschichte. Nach einem kurzen Checkup wird deine Geschichte online gehen.')
})

app.get('/about', (request, response) => {
    response.send('Über das Projekt')
})

app.get('/greet', (request, response) => {
    const name = 'Besucher';
    const timeOfDay = 'Abend';
    response.send(`<p>Liebe*r ${name}, Willkommen auf unserer Webseite.</p>`)
})



// Routes for Bafög experiences / Bafög Erfahrungen

app.get('/experiences', (request, response) => {
    response.send('List of all Bafög experiences')
})

app.post('/experiences', (request, response) => {
    response.send(`New experience added: ${request.body.text}`)
})

app.get('/experiences/:slug', (request, response) => {
    const experienceSlug = request.params.slug;
    response.send(`Details of experience with slug: ${experienceSlug}`)
})

// Routes for Bafög demands / Forderungen
app.get('/demands', (request, response) => {
    response.send('List of all Bafög demands')
})

app.post('/demands', (request, response) => {
    response.send(`New demand added: ${request.body.text}`)
})

app.get('/demands/:slug', (request, response) => {
    const demandSlug = request.params.slug;
    response.send(`Details of demand with slug: ${demandSlug}`)
})
