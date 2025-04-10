const JSONStorage = require("./jsonStorage");
const { v4: uuidv4 } = require("uuid");

class DB {
  constructor(fileName) {
    this.storage = new JSONStorage(`${fileName}.json`);
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

  async create(item) {
    return this.storage.withLock(async () => {
      const items = await this.storage.readFile();
      const newItem = {
        id: uuidv4(),
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      items.push(newItem);
      await this.storage.writeFile(items);
      return newItem;
    });
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
      const filteredItems = items.filter((item) => item.id !== id);
      await this.storage.writeFile(filteredItems);
      return true;
    });
  }
}

module.exports = DB;
