const server = require('./server/index');
const db = require('./database/index');

// db.selectAllUsers((err, res) => {
//   console.log(res);
// })

// db.insertUser('austin', 'reed');
db.selectUserByUsername('austin1', (err, user) => {
  console.log(err, user);
});
