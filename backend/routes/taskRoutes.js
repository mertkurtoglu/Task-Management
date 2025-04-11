const express = require('express');
const router = express.Router();
const {
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Belirli projeye görevler
router.get('/projects/:projectId/tasks', verifyToken, getTasksByProject);
router.post('/projects/:projectId/tasks', verifyToken, createTask);

// Görev güncelleme ve silme
router.put('/tasks/:taskId', verifyToken, updateTask);
router.delete('/tasks/:taskId', verifyToken, deleteTask);

module.exports = router;
