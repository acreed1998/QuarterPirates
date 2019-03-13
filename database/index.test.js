const _ = require('./index');
const db = require('./index');

test('db.insertUser', (done) => {
  db.insertUser('john', 'doe', (err, user) => {
    expect(typeof user).toBe('object');
    done();
  });
});

