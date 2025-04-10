// utils/idManager.js
class IdManager {
  constructor() {
    this.existingIds = new Map();
  }

  /**
   * Generate a new unique ID and track it
   * @param {string} entityType - 'user' or 'event'
   * @returns {string} Generated unique ID
   */
  generateId(entityType) {
    let id;
    do {
      id = this._generateRandomId();
    } while (this.exists(id, entityType));

    this.addId(id, entityType);
    return id;
  }

  /**
   * Check if an ID exists for a specific entity type
   * @param {string} id
   * @param {string} entityType
   * @returns {boolean}
   */
  exists(id, entityType) {
    return (
      this.existingIds.has(entityType) &&
      this.existingIds.get(entityType).has(id)
    );
  }

  /**
   * Add an ID to the tracking system
   * @param {string} id
   * @param {string} entityType
   */
  addId(id, entityType) {
    if (!this.existingIds.has(entityType)) {
      this.existingIds.set(entityType, new Set());
    }
    this.existingIds.get(entityType).add(id);
  }

  /**
   * Remove an ID from the tracking system
   * @param {string} id
   * @param {string} entityType
   */
  removeId(id, entityType) {
    if (this.exists(id, entityType)) {
      this.existingIds.get(entityType).delete(id);
    }
  }

  /**
   * Generate a random ID (private method)
   * @returns {string}
   */
  _generateRandomId() {
    // Customize this based on your ID format requirements
    return [
      Date.now().toString(36),
      Math.random().toString(36).substr(2, 5),
    ].join("-");
  }

  /**
   * Get all IDs for a specific entity type
   * @param {string} entityType
   * @returns {Set}
   */
  getAllIds(entityType) {
    return new Set(this.existingIds.get(entityType) || []);
  }
}

// Singleton instance
module.exports = new IdManager();
