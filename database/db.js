const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'HOST_NAME',
    user: 'USER',
    password: 'PWD',
    database: 'DB_NAME'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = connection;
