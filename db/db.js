const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');
const bcrypt = require('bcrypt');
const pass = "Apan1337";
const saltRounds = 10;

console.log(pass);
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(pass, salt, function(err, hash) {
        console.log(hash);
        bcrypt.compare(pass, hash, function(err, res) {
            console.log(res);
        });
    });
});



let sql = "SELECT * from users";


// db.each(sql, function (err, data) {
//     if(data.username==='HappyHarry'){
//         console.log('Welcome back '+data.username);
//     }
// });

// close the database connection
db.close();