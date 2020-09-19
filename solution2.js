// Overall Time Complexity: O(N) with N being the number of keys
// Overall Space Complexity: O(NB) with N being the number of keys and B being the number of begin

class Database {
  constructor() {
    this.transactions = [{}];
    this.beginCount = 0;
  }

  // time: O(1)
  // space: O(1)
  get(key) {
    return this.transactions[this.beginCount][key];
  }

  // time: O(1)
  // space: O(1)
  set(key, value) {
    // only strings and numbers can be used as valid keys for this database
    if (typeof key === 'string' || typeof key === 'number') {
      this.transactions[this.beginCount][key] = value;
    } else {
      throw new Error(`Cannot support ${typeof key} data type as key`);
    }
  }

  // time: O(1)
  // space: O(1)
  delete(key) {
    if (!this.transactions[this.beginCount][key]) {
      throw new Error('Cannot delete a key that does not exist');
    } else {
      delete this.transactions[this.beginCount][key];
    }
  }

  // time: O(N) with N being the number keys
  // space: O(N) with N being the number keys
  begin() {
    this.transactions.push(JSON.parse(JSON.stringify(this.transactions[this.beginCount])));
    this.beginCount++;
  }

  // time: O(1)
  // space: O(1)
  commit() {
    if (this.beginCount >= 1) {
      this.transactions[this.beginCount - 1] = this.transactions.pop();
      this.beginCount--;
    } else {
      throw new Error('Cannot commit - all the transactions are up to date');
    }
  }

  // time: O(1)
  // space: O(1)
  abort() {
    if (this.transactions.length > 1) {
      this.transactions.pop();
      this.beginCount--;
    } else {
      this.beginCount = 0;
      this.transactions = [{}];
    }
  }
}

module.exports = Database;









