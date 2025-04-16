const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');

// Create a new project (admin or manager)
router.post('/', verifyToken, checkRole('admin', 'manager'), createProject);

// Get all projects
router.get('/', verifyToken, getProjects);

// Get a single project by ID
router.get('/:projectId', verifyToken, getProjectById);

// Update project details (admin or manager)
router.put('/:projectId', verifyToken, checkRole('admin', 'manager'), updateProject);

// Delete a project (admin only)
router.delete('/:projectId', verifyToken, checkRole('admin'), deleteProject);

module.exports = router;
