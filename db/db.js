const sqlite3 = require('sqlite3').verbose();
const appRoot = require('app-root-path');
const db = new sqlite3.Database(appRoot + '/db/db.sqlite');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function encrypt(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
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
    return new Promise((resolve, reject) => {
        let sql = "SELECT password from users where username='" + username + "'";
        db.all(sql, (err, row) => {
            if (err) {
                console.log(err);
                resolve('');
            } else {
                resolve(row);
            }
        })
    });
}

function compareHash(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function (err, res) {
            if (err) {
                reject();
            } else {
                resolve(res);
            }
        });
    });
}

async function addUser(username, password) {
    const hash = await encrypt(password);
    const query = `INSERT INTO users values (null,'${username}','${hash}');`;
    db.run(query, function (err) {
        if (err) {
            console.log('oj nu blidä ärror');
        } else {
            console.log('Added user to DB: ' + username + " " + hash);
        }
    });
}

const login = function (username, password) {
    return new Promise(async (resolve, reject) => {
        if (username && password) {
            let hash = await getHashByUsername(username);
            if (!Array.isArray(hash) || !hash.length) {
                console.log('empty');
                resolve(false);
            } else {
                const accepted = await compareHash(password, hash[0].password);
                resolve(accepted);
            }
        } else {
            console.log("Wrong params");
            reject(false);
        }
    });
};

module.exports = {
    login: login,
    addUser: addUser
};




