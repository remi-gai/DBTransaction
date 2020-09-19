const Database = require('./solution2');

describe('Database Transaction tests', () => {
  let mockDB;

  beforeEach(function() {
    mockDB = new Database();
    mockDB.set('hello','world');
  });

  //Set() method tests
  test('it should add hello/world pair inside the transactions storage', () => {
    expect(mockDB.transactions[0]['hello']).toStrictEqual('world');
  });

  test('it should update the value world to the key earth inside the storage', () => {
    mockDB.set('hello','earth');
    expect(mockDB.transactions[0]['hello']).toStrictEqual('earth');
  });

  test('it should only allow strings and numbers to be used as keys', () => {
    expect(()=> {mockDB.set(null,'earth')}).toThrow('Cannot support object data type as key');
    expect(()=> {mockDB.set({'San':'Francisco'},'earth')}).toThrow('Cannot support object data type as key');
    expect(()=> {mockDB.set(true,'earth')}).toThrow('Cannot support boolean data type as key');
    mockDB.set(5,'five');
    mockDB.set('city','life');
    expect(Object.keys(mockDB.transactions[0]).length).toBe(3);
    expect(mockDB.transactions[0]['5']).toStrictEqual('five');
    expect(mockDB.transactions[0]['city']).toStrictEqual('life');
  });

  //Get() method tests
  test('it should check if the returned value for hello is world', () => {
    expect(mockDB.get('hello')).toBe('world');
  });

  test('it should check if the returned value for hello is world after adding two begins', () => {
    mockDB.begin();
    mockDB.set('city','life');
    mockDB.begin();
    mockDB.set('San', 'Francisco');
    expect(mockDB.get('hello')).toBe('world');
  });

  //begin() method tests
  test('it should add a transaction to the transactions storage', () => {
    mockDB.begin();
    expect(mockDB.transactions.length).toBe(2);
    expect(mockDB.beginCount).toBe(1);
  });

  //abort() method tests
  test('it should remove a transaction from the transactions storage', () => {
    mockDB.begin();
    mockDB.set('city','life');
    expect(mockDB.transactions.length).toBe(2);
    mockDB.abort();
    expect(mockDB.transactions.length).toBe(1);
  });

  test('it should set the transactions storage to an empty object if the beginCount is 0', () => {
    mockDB.abort();
    expect(mockDB.transactions.length).toBe(1);
    expect(Object.keys(mockDB.transactions[0]).length).toBe(0);
  });

  //delete() method tests
  test('it should throw an error if the key does not exist', () => {
    mockDB.begin();
    mockDB.set('city','life');
    expect(()=> {mockDB.delete('Bob')}).toThrow('Cannot delete a key that does not exist');
  });

  test('it should delete the key value pair at the index equivalent of beginCount', () => {
    mockDB.begin();
    mockDB.set('city','life');
    expect(mockDB.get('city')).toBe('life');
    mockDB.delete('city');
    expect(mockDB.get('city')).toBe(undefined);
    expect(mockDB.get('hello')).toBe('world');
    mockDB.delete('hello');
    expect(mockDB.get('hello')).toBe(undefined);
  });

  test('it should delete the key so that a Get query will return undefined without deleting the key/value pair', () => {
    mockDB.begin();
    mockDB.set('city','life');
    expect(mockDB.get('city')).toBe('life');
    expect(mockDB.get('hello')).toBe('world');
    mockDB.delete('hello');
    expect(mockDB.get('hello')).toBe(undefined);
  });

  //commit() method tests
  test('it should merge the current transaction with the previous transaction', () => {
    mockDB.begin();
    mockDB.set('city','life');
    mockDB.commit();
    expect(mockDB.transactions[0]['hello']).toBe('world');
    expect(mockDB.transactions[0]['city']).toBe('life');
  });

  test('it should throw an error with only one transaction', () => {
    expect(()=> {mockDB.commit()}).toThrow('Cannot commit - all the transactions are up to date');
  });

  //abort() method tests
  test('it should remove the latest transaction and decrement the beginCount by 1', () => {
    mockDB.begin();
    mockDB.set('city','life');
    expect(mockDB.transactions.length).toBe(2);
    mockDB.abort();
    expect(mockDB.transactions.length).toBe(1);
  });

  test('it should set the latest transaction to an empty object if beginCount is 0', () => {
    expect(mockDB.transactions.length).toBe(1);
    mockDB.abort();
    expect(mockDB.transactions.length).toBe(1);
  });

  //more complex case
  test('it should check if a more complex case matches our expected answers', () => {
    mockDB.set('San','Francisco');
    mockDB.begin();
    mockDB.set('hello', 'earth1');
    mockDB.set('hello', 'earth2');
    expect(mockDB.get('hello')).toBe('earth2');
    mockDB.begin();
    mockDB.set('city','life');
    mockDB.begin();
    mockDB.set('hello', 'city');
    expect(mockDB.get('hello')).toBe('city');
    expect(mockDB.get('San')).toBe('Francisco');
    mockDB.abort();
    expect(mockDB.get('hello')).toBe('earth2');
    mockDB.commit()
    expect(mockDB.get('hello')).toBe('earth2');
    expect(mockDB.get('city')).toBe('life');
    mockDB.abort();
    expect(mockDB.get('hello')).toBe('world');
  });
});
