const express = require('express');
const router = express.Router();
const {
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Get all tasks for a project
router.get('/projects/:projectId/tasks', verifyToken, getTasksByProject);

// Create a new task for a project (admin or manager)
router.post('/projects/:projectId/tasks', verifyToken, checkRole('admin', 'manager'), createTask);

// Get a task by ID
router.get('/tasks/:taskId', verifyToken, getTaskById);

// Update a task
router.put('/tasks/:taskId', verifyToken, updateTask);

// Delete a task (admin or manager)
router.delete('/tasks/:taskId', verifyToken, checkRole('admin', 'manager'), deleteTask);

module.exports = router;
