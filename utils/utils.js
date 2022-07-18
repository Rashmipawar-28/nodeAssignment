const bcrypt = require('bcrypt');

async function hashedPassword(plainpassword) {
    const hash = bcrypt.hashSync(plainpassword, parseInt(process.env.saltRounds));
     return hash
 };
 module.exports = {
    hashedPassword:hashedPassword
 };