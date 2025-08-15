import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware'; // Import the custom interface

const router = express.Router();

router.get('/', protect, (req: AuthenticatedRequest, res) => {
    // req.user is now correctly typed and accessible
    res.status(200).json({
        message: 'You have access to the protected route!',
        user: req.user
    });
});

export default router;