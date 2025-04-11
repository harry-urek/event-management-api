const express = require('express');
const router = express.Router();
const { validateUser } = require('../utils/validation');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { authenticateToken, hashPassword } = require('../middlewares/securityMiddleware');
const { validateUserId } = require('../middlewares/idValidation');
const { sendWelcomeEmail } = require('../utils/emailService');




router.post('/register', hashPassword, async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({ error: error.message });

        const existingUser = await userModel.findByEmail(req.body.email);
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });
        // await sendWelcomeEmail(req.body.email);

        const user = await userModel.create(req.body);
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });

        delete user.password;
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await userModel.findByEmail(req.body.email);
        if (!user || !(await userModel.comparePassword(user.id, req.body.password))) {
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
        const user = await userModel.getById(req.params.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
