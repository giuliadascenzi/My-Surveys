'use strict';
/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

// open the database
const db = new sqlite.Database('surveys.db', (err) => {
    if (err) throw err;
});

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ADMINS WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {
          // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
          const user = {id: row.id, username: row.username}
          resolve(user);
        }
    });
  });
};

exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ADMINS WHERE username = ?';
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(false);
        }
        else {
          
          const user = {id: row.id, username: row.username};

          // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
          bcrypt.compare(password, row.hash).then(result => {
            if(result) 
              resolve(user);
            else
              resolve(false);
          });
        }
    });
  });
};