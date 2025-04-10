const DB = require('../db/dbManager');
const bcrypt = require('bcryptjs');

class UserModel extends DB {
    constructor() {
        super('users');
    }

    async create(userData) {
        const user = await super.create({
            ...userData,
            role: userData.role || 'attendee'
        });

        return user;
    }

    async findByEmail(email) {
        const users = await this.getAll();
        return users.find(user => user.email === email);
    }

}

module.exports = new UserModel();