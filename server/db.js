require('dotenv').config()
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST, // HOST NAME
    user: process.env.DB_USER, // USER NAME
    database: process.env.DB_NAME, // DATABASE NAME
    password: process.env.DB_PASS // DATABASE PASSWORD
})

module.exports = pool;
