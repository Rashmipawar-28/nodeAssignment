const express = require('express'); //Import the express dependency
require('dotenv').config();

const { Connection } = require('./db')
const routes = require('./routes/index')

const app = express()
//db
Connection.open()

//api routes
app.use(express.json())
app.use('/api/',routes)

app.listen(process.env.Port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${process.env.Port}`); 
});