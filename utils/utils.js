const bcrypt = require('bcrypt');

async function hashedPassword(plainpassword) {
    const hash = bcrypt.hashSync(plainpassword, process.env.saltRounds);
     return hash
 };
 module.exports = {
    hashedPassword:hashedPassword
 };