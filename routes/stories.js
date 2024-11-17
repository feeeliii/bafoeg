import express from 'express';
import Story from '../models/Story.js';

const router = express.Router();

// Get all stories
router.get('/', async (request, response) => {
    try {
        const stories = await Story.find({}).exec();
        response.render('stories/index', { 
            items: stories, 
            itemType: 'story', 
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

// Create story
router.post('/', async (request, response) => {
    try {
        const story = new Story({
            userName: request.body.userName,
            content: request.body.content,
            sentiment: request.body.sentiment
        });
        await story.save();
        response.redirect('/stories');
    } catch (error) {
        console.error(error);
        response.send('Error: Story could not be created');
    }
});

// Get a single story by ID
router.get('/:id', async (request, response) => {
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

// Edit story
router.get('/:id/edit', async (request, response) => {
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

// Update story
router.post('/:id', async (request, response) => {
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

// Delete story
router.get('/:id/delete', async (request, response) => {
    try {
        await Story.findByIdAndDelete(request.params.id);
        response.redirect('/stories');
    } catch (error) {
        console.error(error);
        response.send('Error: No story was deleted.');
    }
});

export default router;