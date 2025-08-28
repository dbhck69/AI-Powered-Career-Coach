import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/score', async (req, res) => {
    const { jobDescription, resumeText } = req.body;

    if (!jobDescription || !resumeText) {
        return res.status(400).json({ message: 'Missing job description or resume text' });
    }

    try {
        // Forward the job description and resume text to the Python microservice
        const { data } = await axios.post(
            'http://127.0.0.1:5001/api/score',
            { jobDescription, resumeText }
        );

        // Respond with the data from the Python service
        res.status(200).json(data);
    } catch (error) {
        console.error('Error forwarding to AI service:', error);
        res.status(500).json({ message: 'Error processing job fit score' });
    }
});

export default router;