const sqlite3 = require("sqlite3").verbose();
const appRoot = require("app-root-path");
const db = new sqlite3.Database(appRoot + "/db/db.sqlite");
const bcrypt = require("bcrypt");
const saltRounds = 10;
/**
 * Turns string into encrypted hash
 *
 * @param   {String}  password  String to encrypt (usually password)
 *
 * @return  {String}            Encrypted hash of indata
 */
function encrypt(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  });
}
/**
 * Gets the hashed password of the account with the username
 *
 * @param   {String}  username  username of the user who's password you want
 *
 * @return  {String}            hashed password of the user
 */
function getHashByUsername(username) {
  return new Promise(resolve => {
    db.all("SELECT password from users where username=?", username, function(
      err,
      result
    ) {
      if (err) {
        console.log(err);
        resolve("");
      } else {
        resolve(result);
      }
    });
  });
}
/**
 * Gets all info from a user by its username
 *
 * @param {String} username
 *
 * @return {Array}
 */
const getAllByUsername = username => {
  return new Promise(resolve => {
    db.all("SELECT * from users where username=?", username, function(
      err,
      result
    ) {
      if (err) {
        console.log(err);
        resolve("");
      } else {
        resolve(result);
      }
    });
  });
};
/**
 * Gets all users that has a username like username
 *
 * @param {String} username
 *
 * @return {Array} all users with matching username and all their info
 */
const searchByUsername = username => {
  return new Promise(resolve => {
    db.all("SELECT * from users where username like %?%", username, function(
      err,
      result
    ) {
      if (err) {
        console.log(err);
        resolve("");
      } else {
        resolve(result);
      }
    });
  });
};
/**
 * Get info about all the users
 *
 * @return {Array} all users in an array
 */
const getAll = () => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * from users";
    db.all(sql, (err, row) => {
      if (err) {
        console.log(err);
        resolve(null);
      } else {
        resolve(row);
      }
    });
  });
};
/**
 * Verifies password
 *
 * @param   {String}  password  Password in text
 * @param   {String}  hash      Hashed password
 *
 * @return  {boolean}
 */
function compareHash(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function(err, res) {
      if (err) {
        reject();
      } else {
        resolve(res);
      }
    });
  });
}
/**
 * Adds a user
 *
 * @param {String} username
 * @param {String} password
 *
 * @return {boolean} if it succeeded
 */
const addUser = (username, password) => {
  return new Promise(async resolve => {
    const hash = await encrypt(password);
    db.all(
      "INSERT INTO users values(null, ?, ?, ?)",
      username,
      hash,
      Date.now(),
      function(err, result) {
        if (err) {
          resolve("");
        } else {
          //   console.log("Added user to DB: " + username + " " + hash);
          resolve(result);
        }
      }
    );
  });
};
/**
 * Tries to log the user in
 *
 * @param {String} username
 * @param {String} password
 *
 * @return {boolean} if it succeeds
 */
const login = function(username, password) {
  return new Promise(async (resolve, reject) => {
    if (username && password) {
      let hash = await getHashByUsername(username);
      if (!Array.isArray(hash) || !hash.length) {
        // console.log("empty");
        resolve(false);
      } else {
        const accepted = await compareHash(password, hash[0].password);
        resolve(accepted);
      }
    } else {
      //   console.log("Wrong params");
      resolve(false);
    }
  });
};
/**
 *
 * @param {String} fromUser username of sender
 * @param {String} to username of receiver
 * @param {String} message
 * @param {int} date
 */
const addMessage = function(fromUser, to, message, date) {
  db.run(
    "INSERT INTO messages VALUES (null,?,?,?,?)",
    fromUser,
    to,
    message,
    date
  );
};
/**
 * gets the 15 last messaged sent to receiver
 *
 * @param {String} receiver username of receiver
 *
 * @return {boolean} if it succeeded
 */
const getLastMessages = async receiver => {
  return new Promise(resolve => {
    db.all(
      "SELECT * from messages where receiver=? order by id desc limit 15",
      receiver,
      function(err, result) {
        resolve(result);
      }
    );
  });
};

module.exports = {
  login: login,
  addUser: addUser,
  getUser: getAllByUsername,
  getAllUsers: getAll,
  searchByUsername: searchByUsername,
  addMessage,
  getLastMessages
};
