const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('organizer', 'attendee').default('attendee')
});

const eventSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    date: Joi.date().greater('now').required(),
    location: Joi.string().required()
});

module.exports = {
    validateUser: (data) => userSchema.validate(data),
    validateEvent: (data) => eventSchema.validate(data)
};