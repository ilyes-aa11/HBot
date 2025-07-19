const mysql = require("mysql2/promise");
require("dotenv").config({path: "../.env"});

async function createConnection() {
    let connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: process.env.MYSQL_DB_PASSWORD, 
        database: "disdb"
    });
    return connection;
}

async function queryDb(sql,connection,param = []) {
    let [rows] = await connection.execute(sql,param);
    return rows;
}

async function endConnection(connection) {
    await connection.end();
}
    

module.exports = {
    createConnection,
    queryDb,
    endConnection
};