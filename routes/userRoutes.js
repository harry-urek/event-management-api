const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { sendWelcomeEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {

        const existingUser = await User.findByEmail(req.body.email);
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        const user = await User.create(req.body);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });
        await sendWelcomeEmail(user.email);
        //delete password from user object
        delete user.password;
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
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

module.exports = router;
