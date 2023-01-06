const mysql = require('mysql2/promise');
const config = require("./../config/dev");

let connection = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    port: config.PORT,
    password: config.PASSWORD,
    database: config.DATABASE
});

module.exports = connection;