const db = require("./db.js");

(async function() {
    let connection = await db.createConnection()
    let res = await db.queryDb("SELECT guild_id,welcome_channel,welcome_message FROM server_conf",connection)
    await db.endConnection(connection)
    console.log(res)
})()