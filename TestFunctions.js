const server = require('./server/index');
const db = require('./database/index');

// db.selectAllUsers((err, res) => {
//   console.log(err, res);
// });

// db.insertUser('acreed1998', 'tigerlamb345', (err, user) => {
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

// db.updateUserGold('austin', '50000000', (err, updateUser) => {
//   console.log(err, updateUser);
// });

// db.updateUserImage('austin', 'google.jpg', (err, res) => {
//   console.log(err, res);
// });

// db.verifyUserPassword('austin', 'persona4dan', (err, res) => {
//   console.log(err, res);
// });

// db.selectAllTreasure((err, res) => {
//   console.log(err, res);
// });

// db.insertTreasure(1000, -90.093109, 29.929470, '1725 Delachaise St.', 'New Orleans', 'LA', '70115', 1, (err, res) => {
//   console.log(err, res);
// });

db.selectTreasuresByUsername('acreed1998', (err, res) => {
  console.log(err, res);
});
