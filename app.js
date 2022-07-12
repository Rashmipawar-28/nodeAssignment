const express = require('express'); //Import the express dependency
require('dotenv').config();
const config_env = JSON.parse(process.env.CONFIG);

const { Connection } = require('./db')
const routes = require('./routes/index')

const app = express()
//db
Connection.open()

//api routes
app.use(express.json())
app.use('/api/',routes)

app.listen(config_env.port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${config_env.port}`); 
});