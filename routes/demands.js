import express from 'express';
import Demand from '../models/Demand.js';

const router = express.Router();

// Get all demands
router.get('/', async (request, response) => {
    try {
        const demands = await Demand.find({}).exec();
        response.render('demands/index', { 
            items: demands, 
            itemType: 'demand', 
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
router.post('/', async (request, response) => {
    try {
        const demand = new Demand({
            userName: request.body.userName,
            content: request.body.content
        });
        await demand.save();
        response.redirect('/demands');
    } catch (error) {
        console.error(error);
        response.send('Error: The demand could not be created.');
    }
});

// Get single demand by ID
router.get('/:id', async (request, response) => {
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

// Edit demand
router.get('/:id/edit', async (request, response) => {
    try {
        const demand = await Demand.findById(request.params.id).exec();
        if (!demand) throw new Error('Demand not found');
        response.render('demands/edit', { 
            demand: demand,
            nameOfPage: 'Edit Demand'
        });
    } catch (error) {
        console.error(error);
        response.status(404).send('Could not find the demand you\'re looking for.');
    }
});

// Update demand
router.post('/:id', async (request, response) => {
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

// Delete demand
router.get('/:id/delete', async (request, response) => {
    try {
        await Demand.findByIdAndDelete(request.params.id);
        response.redirect('/demands');
    } catch (error) {
        console.error(error);
        response.send('Error: No demand was deleted.');
    }
});

export default router;