const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getProjects);

module.exports = router;
