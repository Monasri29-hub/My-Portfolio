import asyncHandler from 'express-async-handler';
import prisma from '../utils/prisma.js';

// @desc    Get all education
// @route   GET /api/education
// @access  Public
const getEducation = asyncHandler(async (req, res) => {
    const education = await prisma.education.findMany({
        orderBy: { startDate: 'desc' },
    });
    res.json(education);
});

// @desc    Add education
// @route   POST /api/education
// @access  Private/Admin
const addEducation = asyncHandler(async (req, res) => {
    const { institution, degree, startDate, endDate, description, current } = req.body;

    const education = await prisma.education.create({
        data: {
            institution,
            degree,
            startDate,
            endDate,
            description,
            current,
        },
    });

    res.status(201).json(education);
});

// @desc    Update education
// @route   PUT /api/education/:id
// @access  Private/Admin
const updateEducation = asyncHandler(async (req, res) => {
    const { institution, degree, startDate, endDate, description, current } = req.body;
    const { id } = req.params;

    const education = await prisma.education.update({
        where: { id },
        data: {
            institution,
            degree,
            startDate,
            endDate,
            description,
            current,
        },
    });

    res.json(education);
});

// @desc    Delete education
// @route   DELETE /api/education/:id
const deleteEducation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.education.delete({ where: { id } });
    res.json({ message: 'Education removed' });
});

export { getEducation, addEducation, updateEducation, deleteEducation };
