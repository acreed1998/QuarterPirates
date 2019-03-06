// Setting up the mysql database & connection and ORM (sequelize)

// 1) Database creation & Table schemas

const mysql = require('mysql');
require('dotenv').config();

// Create connection to the database //
const connection = mysql.createConnection({
  // host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Connect to the database //
connection.connect((err) => {
  if (!err) {
    console.log('Houston, we have a db connection');
  } else {
    console.error('There was a problem connecting to the db. Error: ', err);
  }
});

module.exports.connection = connection;

module.exports.selectAllUsers = (callback) => {
  connection.query('SELECT * FROM Users', (err, users) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, users);
    }
  })
};