const DB = require('../db/dbManager');

class EventModel extends DB {
    constructor() {
        super('events');
    }

    async addParticipant(eventId, userId) {
        const event = await this.getById(eventId);
        if (!event) return null;

        if (!event.participants.includes(userId)) {
            return this.update(eventId, {
                participants: [...event.participants, userId]
            });
        }
        return event;
    }

    async getByOrganizer(organizerId) {
        const events = await this.getAll();
        return events.filter(event => event.organizerId === organizerId);
    }
}

module.exports = new EventModel