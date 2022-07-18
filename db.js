const mongoose = require("mongoose");

class Connection {

    static async open() {
      mongoose.connect(
            `mongodb+srv://${process.env.db_username}:${process.env.db_password}@${process.env.cluster}.mongodb.net/${process.env.dbname}?retryWrites=true&w=majority`, 
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