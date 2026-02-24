import express from 'express';
import { getExperience, addExperience, updateExperience, deleteExperience } from '../controllers/experienceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getExperience)
    .post(protect, admin, addExperience);

router.route('/:id')
    .put(protect, admin, updateExperience)
    .delete(protect, admin, deleteExperience);

export default router;
