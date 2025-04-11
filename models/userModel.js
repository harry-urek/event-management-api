const DB = require('../db/dbManager');
const bcrypt = require('bcrypt');
const IdManager = require('../utils/idManager');

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
    async verifyId(id) {
        return IdManager.verifyId(id);
    }
    async comparePassword(id, candidatePassword) {
        const user = await this.getById(id);
        return bcrypt.compare(candidatePassword, user.password);
    }

}

module.exports = new UserModel();