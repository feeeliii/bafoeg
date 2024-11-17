import express from 'express';

// upvoting for demands
import Demand from '../models/Demand.js';

const router = express.Router();

router.post('/upvote/demand/:id', async (req, res) => {
    console.log(`Upvoting demand with ID: ${req.params.id}`);
    try {
        const demand = await Demand.findById(req.params.id);
        if (demand) {
            demand.upvotes += 1;
            await demand.save();
            res.json({ newVoteCount: demand.upvotes });
        } else {
            res.status(404).send('Demand not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//upvoting for stories
import Story from '../models/Story.js';

router.post('/upvote/story/:id', async (req, res) => {
    console.log(`Upvoting demand with ID: ${req.params.id}`);
    try {
        const story = await Story.findById(req.params.id);
        if (story) {
            story.upvotes += 1;
            await story.save();
            res.json({ newVoteCount: story.upvotes });
        } else {
            res.status(404).send('Story not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router;
