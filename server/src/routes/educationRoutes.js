import express from 'express';
import { getEducation, addEducation, updateEducation, deleteEducation } from '../controllers/educationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getEducation)
    .post(protect, admin, addEducation);

router.route('/:id')
    .put(protect, admin, updateEducation)
    .delete(protect, admin, deleteEducation);

export default router;
