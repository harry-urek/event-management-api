const EventModel = require('../models/eventModel');
const UserModel = require('../models/userModel');

const validateUserId = async (req, res, next) => {
    const { userId } = req.params;
    if (!(await UserModel.verifyId(userId))) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }
    next();
};

const validateEventId = async (req, res, next) => {
    const { eventId } = req.params;
    if (!(await EventModel.verifyId(eventId))) {
        return res.status(404).json({ error: 'Invalid event ID' });
    }
    next();
};

module.exports = { validateUserId, validateEventId };