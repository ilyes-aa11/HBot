const mysql = require("mysql2/promise");
const path = require('path');
require("dotenv").config({path: path.resolve(__dirname,'..','./env')});

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_DB_PASSWORD, 
    database: "disdb"
});
    
module.exports = pool;