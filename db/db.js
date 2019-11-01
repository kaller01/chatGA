const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function encrypt(password) {
    return new Promise((resolve, reject) =>{
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

async function addUser(username, password) {
    const hash = await encrypt(password);
    console.log('Rätt hash '+hash);
    const query = `INSERT INTO users values (null,'${username}','${hash}');`;
    db.run(query,function (err) {
        if(err){
            console.log('oj nu blidä ärror');
        } else {
            console.log('Added user to DB: '+username);
        }
    });
}

function getHashByUsername(username) {
    return new Promise((resolve, reject) =>{
        let sql = "SELECT password from users where username='"+username+"'";
        db.all(sql, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        })
    });
}

function compareHash(password, hash){
    return new Promise((resolve, reject) => {
        bcrypt.compare(password,hash, function(err, res) {
            resolve(res);
        });
    });
}

async function login(username, password){
    let hash = await getHashByUsername(username);
    const accepted = await compareHash(password, hash[0].password);
    console.log(accepted);

}

login('HappyHarry','Apan1337');

addUser('ChillarN3','password');




