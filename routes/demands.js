import express, { response } from 'express';
import Demand from '../models/Demand.js';
import User from '../models/User.js';

const router = express.Router();

// Get all demands
router.get('/', async (request, response) => {
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
// router.post('/', async (request, response) => {
//     try {
//         const demand = new Demand({
//             userName: request.body.userName,
//             content: request.body.content
//         });
//         await demand.save();
//         response.redirect('/demands');
//     } catch (error) {
//         console.error(error);
//         response.send('Error: The demand could not be created.');
//     }
// });


//Create new demand
router.post('/', async (request, response) => {
    try {
        const { userId, content } = request.body;

        const user = await User.findById(userId);
        if (!user) {
            return response.status(400).json({ error: 'User not found'});
        }

        const demand = new Demand ({
            user: user._id,
            content: content
        });

        const savedDemand = await demand.save();
        user.forderungen = user.forderungen.concat(savedDemand._id);
        await user.save();

        response.redirect('/demands');

    } catch (error) {
        console.error(error);
        response.status(500).send('Error: The demand could not be created');
    }
})

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