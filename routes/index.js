const express = require('express');
const router = express.Router();
const User = require('../controllers/userController')


router.get('/getusers',User.getAllUsers);
router.get('/getSingleUser/:userId',User.getSingleUser);
router.post('/createuser',User.createUser);
router.put('/updateUser/:userId',User.updateUser)
router.delete('/deleteUser/:userId',User.deleteUser)

module.exports = router;
