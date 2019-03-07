const server = require('./server/index');
const db = require('./database/index');

// db.selectAllUsers((err, res) => {
//   console.log(err, res);
// });

// db.insertUser('austin1', 'reed2', (err, user) => {
//   console.log(err, user);
// });

// db.selectUserByUsername('austin', (err, user) => {
//   console.log(err, user);
// });

// db.selectUserById(1, (err, user) => {
//   console.log(err, user);
// });

// db.updateUserPassword({ username: 'austin' }, { oldPassword: 'tigerlamb345', newPassword: 'persona4dan' }, (err, updatedUser) => {
//   console.log(err, updatedUser);
// });