import asyncHandler from 'express-async-handler';
import prisma from '../utils/prisma.js';

// @desc    Get all experience
// @route   GET /api/experience
// @access  Public
const getExperience = asyncHandler(async (req, res) => {
    const experience = await prisma.experience.findMany({
        orderBy: { startDate: 'desc' },
    });
    res.json(experience);
});

// @desc    Add experience
// @route   POST /api/experience
// @access  Private/Admin
const addExperience = asyncHandler(async (req, res) => {
    const { company, role, startDate, endDate, description, current, certificationUrl } = req.body;

    const experience = await prisma.experience.create({
        data: {
            company,
            role,
            startDate,
            endDate: endDate || null,
            description: description || null,
            certificationUrl: certificationUrl || null,
            current: Boolean(current),
        },
    });

    res.status(201).json(experience);
});

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private/Admin
const updateExperience = asyncHandler(async (req, res) => {
    const { company, role, startDate, endDate, description, current, certificationUrl } = req.body;
    const { id } = req.params;

    const experience = await prisma.experience.update({
        where: { id },
        data: {
            company,
            role,
            startDate,
            endDate: endDate || null,
            description: description || null,
            certificationUrl: certificationUrl || null,
            current: Boolean(current),
        },
    });

    res.json(experience);
});

// @desc    Delete experience
// @route   DELETE /api/experience/:id
const deleteExperience = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    res.json({ message: 'Experience removed' });
});

export { getExperience, addExperience, updateExperience, deleteExperience };
