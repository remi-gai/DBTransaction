// Overall Time Complexity: O(NB) with N being the number of keys and B being the number of begin
// Overall Space Complexity: O(NB) with N being the number of keys and B being the number of begin

class Database {
  constructor() {
    this.transactions = [{}];
    this.beginCount = 0;
    this.deletedKeys = {};
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

  // time: O(B) with B being the number of begin
  // space: O(1)
  get(key) {
    // if the key is in deletedKeys, return undefined
    if (this.deletedKeys[key]) {
      return undefined;
    } else if (this.transactions[this.beginCount][key]) {
    // if the key is in the latest transaction, return the value
      return this.transactions[this.beginCount][key];
    }
    //iterate backwards through the transactions until the key is found, else return undefined
    let lastTransactionIndex = this.transactions.length - 1;
    while (lastTransactionIndex > -1) {
      if (this.transactions[lastTransactionIndex][key]) {
        return this.transactions[lastTransactionIndex][key];
      }
      lastTransactionIndex--;
    }
    return undefined
  }

  // time: O(B)
  // space: O(1)
  delete(key) {
    if (this.get(key) === undefined) {
      throw new Error('Cannot delete a key that does not exist');
    } else {
      this.deletedKeys[key] = true;
      delete this.transactions[this.beginCount][key];
    }
  }

  // time: O(1)
  // space: O(1)
  begin() {
    this.transactions.push({});
    this.beginCount++;
  }

  // time: O(1)
  // space: O(1)
  abort() {
    if (this.transactions.length > 1) {
      this.transactions.pop();
      this.deletedKeys = {};
      this.beginCount--;
    } else {
      this.transactions = [{}]
      this.deletedKeys = {};
      this.beginCount = 0;
    }
  }

  // time: O(N) with N being the number of keys
  // space: O(1)
  commit() {
    if (this.beginCount >= 1) {
      const lastTransaction = this.transactions.length - 1;
      const previousTransaction = lastTransaction - 1;
      for (let key in this.transactions[lastTransaction]) {
          this.transactions[previousTransaction][key] = this.transactions[lastTransaction][key];
      }
      // delete labeled keys in the previous transaction based on deletedKeys
      for (let key in this.deletedKeys) {
        delete this.transactions[previousTransaction][key];
      }
      this.transactions.pop();
      this.deletedKeys = {};
      this.beginCount--;
    } else {
      throw new Error('Cannot commit - all the transactions are up to date');
    }
  }

}

module.exports = Database;