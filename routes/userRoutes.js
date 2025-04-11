const express = require('express');
const router = express.Router();
const { validateUser } = require('../utils/validation');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { authenticateToken, hashPassword } = require('../middlewares/securityMiddleware');
const { validateUserId } = require('../middlewares/idValidation');
const { sendWelcomeEmail } = require('../utils/emailService');
const User = userModel;



router.post('/register', hashPassword, async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({ error: error.message });

        const existingUser = await User.findByEmail(req.body.email);
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });
        await sendWelcomeEmail(req.body.email);
        delete user.password;

        const user = await User.create(req.body);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByEmail(req.body.email);
        if (!user || !(await User.comparePassword(user.id, req.body.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });

        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:userId', authenticateToken, validateUserId, async (req, res) => {
    try {
        const user = await User.getById(req.params.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
