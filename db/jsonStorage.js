const fs = require("fs").promises;
const path = require("path");
const { Mutex } = require("async-mutex");

class JSONStorage {
  constructor(filePath) {
    this.filePath = path.join(__dirname, "../data", filePath);
    this.mutex = new Mutex();
    this.initialize();
  }

  async initialize() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      await this.writeFile([]);
    }
  }

  async readFile() {
    const data = await fs.readFile(this.filePath, "utf8");
    return JSON.parse(data);
  }

  async writeFile(data) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async withLock(fn) {
    const release = await this.mutex.acquire();
    try {
      const result = await fn();
      return result;
    } finally {
      release();
    }
  }
}

module.exports = JSONStorage;
