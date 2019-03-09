// Setting up the mysql database & connection and ORM (sequelize)

// 1) Database creation & Table schemas

const mysql = require('mysql');
const crypto = require('crypto');
const axios = require('axios');
const _ = require('lodash');
const Avatars = require('@dicebear/avatars').default;
const sprites = require('@dicebear/avatars-jdenticon-sprites').default;
require('dotenv').config();


let options = {};
let avatars = new Avatars(sprites(options));
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

// USER RELATIVE HELPER FUNCTIONS //

const filterUserInfo = (user) => {
  const obj = {};
  const filters = ['password', 'salt'];
  _.forEach(user, (value, key) => {
    if (!_.includes(filters, key)) {
      obj[key] = value;
    }
  });
  return obj;
};

module.exports.insertUser = (username, password, callback) => {
  module.exports.selectAllUsers((err, users) => {
    if (err) {
      callback(err, null);
    } else {
      module.exports.selectUserByUsername(username, (err2, user) => {
        if (err2) {
          callback(err2, null);
        } else if (user === undefined) {
          const salt = crypto.randomBytes(16).toString('hex');
          const avatar = avatars.create(username);
          const q = [username, crypto.pbkdf2Sync(password, salt, 1012, 50, 'sha512').toString('hex'), salt, avatar];
          connection.query('INSERT INTO Users (username, password, salt, avatar) VALUES (?, ?, ?, ?)', q, (err3) => {
            if (err3) {
              callback(err3, null);
            } else {
              module.exports.selectUserByUsername(username, (err4, newUser) => {
                if (err4) {
                  callback(err4, null);
                } else {
                  callback(null, newUser);
                }
              })
            }
          });
        } else {
          callback(Error('User already exists'), user);
        }
      })
    }
  });
};

module.exports.selectAllUsers = (callback) => {
  connection.query('SELECT * FROM Users', (err, users) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, users);
    }
  })
};

module.exports.selectUserByUsername = (username, callback) => {
  connection.query(`SELECT * FROM Users WHERE username = '${username}'`, (err, singleUserArray) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, singleUserArray[0]);
    }
  })
};

module.exports.selectUserById = (id_user, callback) => {
  connection.query(`SELECT * FROM Users WHERE id = ${id_user}`, (err, singleUserArray) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, singleUserArray[0]);
    }
  })
};

/* 
user and password are objects
user needs either a useranme or id_user key
password needs an oldPassword and newPassword key
*/
module.exports.updateUserPassword = (user, password, callback) => {
  if (user.username) {
    module.exports.selectUserByUsername(user.username, (err, user) => {
      if (err) {
        callback(err, null);
      } else {
        if (crypto.pbkdf2Sync(password.oldPassword, user.salt, 1012, 50, 'sha512').toString('hex') === user.password) {
          connection.query(`UPDATE Users SET password = '${crypto.pbkdf2Sync(password.newPassword, user.salt, 1012, 50, 'sha512').toString('hex')}' WHERE username = '${user.username}'`, (err2) => {
            if (err2) {
              callback(err2, null);
            } else {
              module.exports.selectUserByUsername(user.username, (err3, updatedUser) => {
                if (err3) {
                  callback(err3, null);
                } else {
                  callback(null, updatedUser);
                }
              });
            }
          });
        } else {
          callback(Error('Passwords did not match'), null);
        }
      }
    });
  } else if (user.id_user) {
    module.exports.selectUserById(user.id_user, (err4, user) => {
      if (err4) {
        callback(err4, null);
      } else {
        if (crypto.pbkdf2Sync(password.oldPassword, user.salt, 1012, 50, 'sha512').toString('hex') === user.password) {
          connection.query(`UPDATE users SET password = '${crypto.pbkdf2Sync(password.newPassword, user.salt, 1012, 50, 'sha512').toString('hex')}' WHERE username = '${user.username}'`, (err5) => {
            if (err5) {
              callback(err5, null);
            } else {
              module.exports.selectUserById(user.username, (err6, updatedUser) => {
                if (err6) {
                  callback(err6, null);
                } else {
                  callback(null, updatedUser);
                }
              });
            }
          });
        } else {
          callback(Error('Passwords did not match'), null);
        }
      }
    });
  }
};

module.exports.updateUserGold = (username, amount, callback) => {
  module.exports.selectUserByUsername(username, (err, user) => {
    if (err) {
      callback(err, null);
    } else {
      connection.query(`UPDATE Users SET gold = ${user.gold + parseInt(amount)} WHERE username = '${username}'`, (err2) => {
        if (err2) {
          callback(err2, null);
        } else {
          module.exports.selectUserByUsername(username, (err3, updatedUser) => {
            if (err3) {
              callback(err3, null);
            } else {
              callback(null, updatedUser);
            }
          });
        }
      });
    }
  });
}

module.exports.updateUserImage = (username, avatar, callback) => {
  const extensions = ['.jpg', '.png', 'jpeg', 'svg>'];
  if(_.includes(extensions, _.slice(avatar, avatar.length - 4).join(''))) {
    connection.query(`UPDATE Users Set avatar = '${avatar}' WHERE username = '${username}'`, (err) => {
      if (err) {
        callback(err, null);
      } else {
        module.exports.selectUserByUsername(username, (err2, updatedUser) => {
          if (err2) {
            callback(err2, null);
          } else {
            callback(null, updatedUser);
          }
        });
      }
    });
  } else {
    callback(Error('Invalid image file/link'), null);
  }
};

module.exports.verifyUserPassword = (username, password, callback) => {
  module.exports.selectUserByUsername(username, (err, user) => {
    if (err) {
      callback(err, null);
    } else {
      if (user.password === crypto.pbkdf2Sync(password, user.salt, 1012, 50, 'sha512').toString('hex')) {
        const fileredUser = filterUserInfo(user)
        module.exports.selectTreasuresByUsername(fileredUser.username, (err2, treasures) => {
          if (err2) {
            callback(err2, null);
          } else {
            fileredUser.treasures = treasures;
            module.exports.selectRiddlesByUsername(fileredUser.username, (err3, riddles) => {
              if (err3) {
                callback(err3, null);
              } else {
                fileredUser.riddles = riddles;
                callback(null, fileredUser);
              }
            });
          }
        });
      } else {
        callback(Error('Invalid Username or Password'), null);
      }
    }
  });
};

// END OF USER RELATIVE HELPER FUNCTIONS //

// TREASURE RELATIVE HELPER FUNCIONS //

module.exports.insertTreasure = (gold_value, longitude, latitude, address, city, state, zipcode, id_user, callback) => {
  const q = [gold_value, parseFloat(longitude), parseFloat(latitude), address, city, state, parseInt(zipcode)];
  connection.query('INSERT INTO Treasures (gold_value, longitude, latitude, address, city, state, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?)', q, (err) => {
    if (err) {
      callback(err, null);
    } else {
      module.exports.selectAllTreasure((err2, treasures) => {
        if (err2) {
          callback(err2, null);
        } else {
          const newTreasure = treasures[treasures.length - 1];
          connection.query('INSERT INTO UserTreasures (id_user, id_treasure) VALUES (?, ?)', [id_user, newTreasure.id], (err3) => {
            if (err3) {
              callback(err3, null);
            } else {
              callback(null, newTreasure);
            }
          });
        }
      });
    }
  });
};

module.exports.selectAllTreasure = (callback) => {
  connection.query('SELECT * FROM Treasures', (err, treasures) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, treasures);
    }
  });
};

module.exports.selectTreasuresByUsername = (username, callback) => {
  module.exports.selectUserByUsername(username, (err, user) => {
    if (err) {
      callback(err, null);
    } else {
      connection.query(`SELECT * FROM UserTreasures WHERE id_user = ${user.id}`, (err2, pairs) => {
        if (err2) {
          callback(err2, null);
        } else if (pairs.length !== 0) {
          const plantIds = _.map(pairs, pair => pair.id_treasure);
          const userPlants = [];
          _.forEach(plantIds, (id, index) => {
            module.exports.selectTreasureById(id, (err3, treasure) => {
              if (err3) {
                callback(err3, null);
              } else {
                userPlants.push(treasure);
                if (index === plantIds.length - 1) {
                  callback(null, userPlants);
                }
              }
            });
          });
        } else {
          callback(null, []);
        }
      });
    }
  });
};

module.exports.selectTreasureById = (id_treasure, callback) => {
  connection.query(`SELECT * FROM Treasures WHERE id = ${id_treasure}`, (err, singleTreasureArray) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, singleTreasureArray[0]);
    }
  });
};

module.exports.selectTreasuresByZipcode = (zipcode, callback) => {
  connection.query(`SELECT * FROM Treasures WHERE zipcode = ${parseInt(zipcode)}`, (err, treasures) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, treasures);
    }
  });
}

module.exports.updateTreasureDateClaimed = (id_treasure, callback) => {
  connection.query(`UPDATE Treasures SET date_claimed = CURRENT_TIMESTAMP WHERE id = ${parseInt(id_treasure)}`, (err) => {
    if (err) {
      callback(err, null);
    } else {
      module.exports.selectTreasureById(parseInt(id_treasure), (err2, updatedTreasure) => {
        if (err2) {
          callback(err2, null);
        } else {
          callback(null, updatedTreasure);
        }
      });
    }
  });
};

module.exports.deleteTreasureById = (id_treasure, callback) => {
  connection.query(`DELETE FROM Treasures WHERE id = ${id_treasure}`, (err) => {
    if (err) {
      callback(err, null);
    } else {
      connection.query(`DELETE FROM Riddles WHERE id_treasure = ${id_treasure}`, (err2) => {
        if (err2) {
          callback(err2, null);
        } else {
          connection.query(`DELETE FROM UserTreasures`)
        }
      });
    }
  });
};

// END OF TREASURE RELATIVE HELPER FUNCTIONS //

// RIDDLE RELATIVE HELPER FUNCTIONS //

module.exports.insertRiddle = (title, latitude, longitude, address, city, state, zipcode, riddle, id_treasure, callback) => {
  const q = [title, parseFloat(latitude), parseFloat(longitude), address, city, state, parseInt(zipcode), riddle, parseInt(id_treasure)];
  connection.query('INSERT INTO Riddles (title, latitude, longitude, address, city, state, zipcode, date_created, riddle, id_treasure) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)', q, (err) => {
    if (err) {
      callback(err, null);
    } else {
      module.exports.selectAllRiddles((err2, riddles) => {
        if (err2) {
          callback(err2, null);
        } else {
          callback(null, riddles[riddles.length - 1]);
        }
      });
    }
  });
};

module.exports.selectAllRiddles = (callback) => {
  connection.query('SELECT * FROM Riddles', (err, riddles) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, riddles);
    }
  })
};

module.exports.selectRiddleByTreasure = (id_treasure, callback) => {
  connection.query(`SELECT * FROM Riddles WHERE id_treasure = ${parseInt(id_treasure)}`, (err, singleTreasureArray) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, singleTreasureArray[0]);
    }
  });
};

module.exports.selectRiddlesByUsername = (username, callback) => {
  module.exports.selectTreasuresByUsername(username, (err, treasures) => {
    if (err) {
      callback(err, null);
    } else {
      if (treasures.length !== 0) {
        const treasureIds = _.map(treasures, treasure => treasure.id);
        const riddles = [];
        _.forEach(treasureIds, (id, index) => {
          module.exports.selectRiddleByTreasure(id, (err2, riddle) => {
            if (err2) {
              callback(err2, null);
            } else {
              riddles.push(riddle);
              if (index === treasureIds.length - 1) {
                callback(null, _.filter(riddles, riddle => riddle !== undefined));
              }
            }
          });
        });
      } else {
        callback(null, []);
      }
    }
  });
};

module.exports.updateRiddleViews = (username, id_riddle, callback) => {
  module.exports.selectUserByUsername(username, (err, user) => {
    if (err) {
      callback(err, null);
    } else if (user === undefined) {
      callback(null, []);
    } else {
      connection.query(`SELECT * FROM RiddleViews WHERE id_user = ${user.id}`, (err2, pairs) => {
        if (err2) {
          callback(err2, null);
        } else {
          if (pairs.length === 0) {
            module.exports.selectRiddleById(parseInt(id_riddle), (err, riddle) => {
              if (err) {
                callback(err, null);
              } else {
                connection.query(`UPDATE Riddles SET views = ${riddle.views + 1} WHERE id = ${parseInt(id_riddle)}`, (err2) => {
                  if (err2) {
                    callback(err2, null);
                  } else {
                    connection.query(`INSERT INTO RiddleViews (id_user, id_riddle) VALUES (?, ?)`, [user.id, parseInt(id_riddle)], (err3) => {
                      if (err3) {
                        callback(err3, null);
                      } else {
                        module.exports.selectRiddleById(parseInt(id_riddle), (err4, updatedRiddle) => {
                          if (err4) {
                            callback(err4, null);
                          } else {
                            callback(null, updatedRiddle);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            if (_.includes(_.map(pairs, pair => pair.id_riddle), parseInt(id_riddle))) {
              callback(null, []);
            } else {
              module.exports.selectRiddleById(parseInt(id_riddle), (err, riddle) => {
                if (err) {
                  callback(err, null);
                } else {
                  connection.query(`UPDATE Riddles SET views = ${riddle.views + 1} WHERE id = ${parseInt(id_riddle)}`, (err2) => {
                    if (err2) {
                      callback(err2, null);
                    } else {
                      connection.query(`INSERT INTO RiddleViews (id_user, id_riddle) VALUES (?, ?)`, [user.id, parseInt(id_riddle)], (err) => {
                        if (err3) {
                          callback(err3, null);
                        } else {
                          module.exports.selectRiddleById(parseInt(id_riddle), (err4, updatedRiddle) => {
                            if (err4) {
                              callback(err4, null);
                            } else {
                              callback(null, updatedRiddle);
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        }
      }); 
    }
  });
};

module.exports.selectRiddleById = (id_riddle, callback) => {
  connection.query(`SELECT * FROM Riddles WHERE id = ${parseInt(id_riddle)}`, (err, singleRiddleArray) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, singleRiddleArray[0]);
    }
  });
};

// END OF RIDDLE RELATIVE HELPER FUNCTIONS //

// GOLD TRANSACTION HELPER FUNCTIONS //

module.exports.insertGoldTransaction = (id_user, gold_value, callback) => {
  const q = [parseInt(id_user), parseInt(gold_value)];
  connection.query(`INSERT INTO GoldTransactions (id_user, gold_value) VALUES (?, ?)`, q, (err) => {
    if (err) {
      callback(err, null);
    } else {
      module.exports.selectAllGoldTransactions((err2, transactions) => {
        if (err2) {
          callback(err2, null);
        } else {
          callback(null, transactions[transactions.length - 1]);
        }
      });
    }
  });
};

module.exports.selectAllGoldTransactions = (callback) => {
  connection.query('SELECT * FROM GoldTransactions', (err, gold_transactions) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, gold_transactions);
    }
  });
};
