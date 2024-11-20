import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

// Create profile
router.post('/', async (req, res) => {
    console.log(req.body);
    try {
        const profile = new Profile(req.body);
        await profile.save();
        res.status(201).send(profile);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update profile
router.put('/:id', async (req, res) => {
    try {
        const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!profile) {
            return res.status(404).send();
        }
        res.send(profile);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete profile
router.delete('/:id', async (req, res) => {
    try {
        const profile = await Profile.findByIdAndDelete(req.params.id);
        if (!profile) {
            return res.status(404).send();
        }
        res.send(profile);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
