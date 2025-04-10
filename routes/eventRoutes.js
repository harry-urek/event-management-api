const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModel');
const { validateEvent } = require('../utils/validation');
const { sendRegistrationEmail } = require('../utils/emailService');

router.post('/', async (req, res) => {
    try {
        const { error } = validateEvent(req.body);
        if (error) return res.status(400).json({ error: error.message });

        const event = await eventModel.create({
            ...req.body,
            organizerId: req.user.id
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const events = await eventModel.getAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/:eventId', async (req, res) => {
    try {
        const event = await eventModel.addParticipant(req.params.eventId, req.user.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        await sendRegistrationEmail(req.user.email, event.title);
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:eventId', async (req, res) => {
    try {
        const existingEvent = await eventModel.getById(req.params.eventId);
        if (!existingEvent) return res.status(404).json({ error: 'Event not found' });

        if (existingEvent.organizerId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized: Only the organizer can update this event' });
        }

        // Validate update data
        const { error } = validateEvent(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        // Update the event
        const updatedEvent = await eventModel.update(req.params.eventId, {
            ...req.body,
            organizerId: req.user.id,
            participants: existingEvent.participants // Preserve participants
        });

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:eventId', async (req, res) => {
    try {
        const existingEvent = await eventModel.getById(req.params.eventId);
        if (!existingEvent) return res.status(404).json({ error: 'Event not found' });
        // Delete the event
        await eventModel.delete(req.params.eventId);

        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;