const express = require('express');
const router = express.Router();
const { register, login, getUsers, getUserById, deleteUser, updateUser } = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Register a new user
router.post('/register', register);

//Login a user
router.post('/login', login);

//Get all users 
router.get('/users', verifyToken, getUsers);

// Get a single user by ID
router.get('/user/:id', verifyToken, getUserById);

// Update user details (admin only)
router.put('/user/:id', verifyToken, checkRole('admin'), updateUser);

// Delete a user (admin only)
router.delete('/user/:id', verifyToken, checkRole('admin'), deleteUser);

module.exports = router;
