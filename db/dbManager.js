const JSONStorage = require("./jsonStorage");
const IdManager = require("../utils/idManager");

class DB {

  constructor(entityType) {
    this.storage = new JSONStorage(`${entityType}s.json`);
    this.entityType = entityType;
  }

  async create(data) {
    return this.storage.withLock(async () => {
      const items = await this.storage.readFile();
      const id = IdManager.generateId(this.entityType);
      const newItem = {
        id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(newItem);
      await this.storage.writeFile(items);
      return newItem;
    });
  }


  async getAll() {
    return this.storage.withLock(async () => {
      return this.storage.readFile();
    });
  }

  async getById(id) {
    const items = await this.getAll();
    return items.find((item) => item.id === id);
  }



  async update(id, updates) {
    return this.storage.withLock(async () => {
      const items = await this.storage.readFile();
      const index = items.findIndex((item) => item.id === id);

      if (index === -1) return null;

      const updatedItem = {
        ...items[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      items[index] = updatedItem;
      await this.storage.writeFile(items);
      return updatedItem;
    });
  }

  async delete(id) {
    return this.storage.withLock(async () => {
      const items = await this.storage.readFile();
      const filteredItems = items.filter(item => item.id !== id);
      await this.storage.writeFile(filteredItems);
      IdManager.removeId(id, this.entityType);
      return true;
    });
  }

}

module.exports = DB;
