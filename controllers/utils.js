const bcrypt = require('bcrypt');
const config_env = JSON.parse(process.env.CONFIG);

async function hashedPassword(plainpassword) {
    const hash = bcrypt.hashSync(plainpassword, config_env.saltRounds);
     return hash
 };
 module.exports = {
    hashedPassword:hashedPassword
 };