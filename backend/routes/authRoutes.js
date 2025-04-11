const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: `Welcome, user ${req.user.userId}`, role: req.user.role });
});

router.get('/admin-only', verifyToken, checkRole('admin'), (req, res) => {
    res.json({ message: 'Only admins can see this.' });
});

module.exports = router;