const sqlite3 = require("sqlite3").verbose();
const appRoot = require("app-root-path");
const db = new sqlite3.Database(appRoot + "/db/db.sqlite");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

const addMessage = function(fromUser, to, message, date) {
  db.run(
    "INSERT INTO messages VALUES (null,?,?,?,?)",
    fromUser,
    to,
    message,
    date
  );
};

const getLastMessages = async receiver => {
  return new Promise(resolve => {
    db.all(
      "SELECT * from messages where receiver=? order by id desc limit 10",
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
