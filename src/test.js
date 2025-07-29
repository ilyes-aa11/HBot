const mysql = require("./mysqldb/db.js");
require("dotenv").config();

(async function() {
    const connection = await mysql.createConnection();
    let row = await mysql.queryDb("SELECT roles,buttons FROM btnroles_conf WHERE guild_id=?",connection,["1148965947231698954"]);
    let test = row[0].roles;
    console.log(typeof test,test[0])
    await mysql.endConnection(connection)
})()
