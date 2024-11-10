import express from 'express';

const router = express.Router();

router.get('/facts', (request, response) => {
    try {
        response.render('facts/index', { nameOfPage: 'Zahlen & Fakten' });
    } catch (error) {
        console.error(error);
        response.status(500).send('Server error');
    }
});

router.get('/project', (request, response) => {
    try {
        response.render('project/index', { nameOfPage: 'Über das Projekt' });
    } catch (error) {
        console.error(error);
        response.status(500).send('Server error');
    }
});

router.get('/privacy', (request, response) => {
    try {
        response.render('privacy/index', { nameOfPage: 'Datenschutz' });
    } catch (error) {
        console.error(error);
        response.status(500).send('Server error');
    }
});

export default router;