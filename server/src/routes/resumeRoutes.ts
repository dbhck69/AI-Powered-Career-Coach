import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume';
import { protect, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post('/upload', protect, upload.single('resume'), async (req: AuthenticatedRequest, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const filePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
    
    const formData = new FormData();
    formData.append('resume', fs.createReadStream(filePath), req.file.filename);

    const { data } = await axios.post(
      'http://127.0.0.1:5001/api/analyze',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    
    const newResume = new Resume({
        user: req.user?._id,
        extractedText: data.extractedText,
        extractedSkills: data.extractedSkills,
    });

    await newResume.save();

    res.status(200).json({
        message: 'Resume uploaded and processed successfully',
        data: newResume,
    });
  } catch (error) {
    console.error('Error forwarding to AI service:', error);
    res.status(500).json({ message: 'Error processing resume with AI service' });
  }
});

// New route to fetch the latest resume for a user
router.get('/latest', protect, async (req: AuthenticatedRequest, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user?._id }).sort({ createdAt: -1 });
        if (!resume) {
            return res.status(404).json({ message: 'No resume found for this user.' });
        }
        res.status(200).json(resume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;