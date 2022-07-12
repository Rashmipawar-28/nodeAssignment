const mongoose = require("mongoose");
const config_env = JSON.parse(process.env.CONFIG);


class Connection {

    static async open() {
      mongoose.connect(
            `mongodb+srv://${config_env.database.username}:${config_env.database.password}@${config_env.database.cluster}.mongodb.net/${config_env.database.dbname}?retryWrites=true&w=majority`, 
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true 
            }
            );
            const db = mongoose.connection;
            db.on("error", console.error.bind(console, "connection error: "));
            db.once("open", function () {
            console.log("Connected successfully");
            });
    }

}


module.exports = { Connection }