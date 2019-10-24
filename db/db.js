const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// console.log(pass);
// bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(pass, salt, function(err, hash) {
//         console.log(hash);
//         // let query = `UPDATE users set password = '${hash}' WHERE id=2`;
//         // db.run(query);
//         //
//
//     });
// });

const username = 'HappyHarry';
const pass = "Apan1337";

// db.each(sql, function (err, data) {
//     if(data=hash)
//         console.log(data);
// });
let sql = "SELECT password from users where username='"+username+"'";
db.all(sql, (err, data)=>{
    const hash = data[0].password;
    bcrypt.compare(pass, hash, function(err, res) {
        console.log(res);
    });
});

db.close();

// close the database connection
