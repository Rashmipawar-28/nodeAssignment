const Users = require('../models/user')
const mongoose = require("mongoose");
const user = require('../models/user');
const utils = require('../utils/utils')
const ObjectId = mongoose.Types.ObjectId; 


module.exports = {
    async getAllUsers(req,res){
        const users = await Users.find({"deletedAt" : null }).select('-password');
       try{
            if(users){
            //    const userList = await users.filter((user)=>{
            //         if(user.deletedAt == null){
            //             return user
            //         }
            //     })
                res.status(200).send({
                    status:'ok',
                    data:users
                })
            }else{
                res.status(422).send({
                    status:"Unprocessable Entity",
                    msg:"No users found"
                })
            }
       }catch(error){
        res.status(500).send({
            status:'Internal Server Error',
            msg:"error while getting users"
        })
       }
    },

    async getSingleUser(req,res){
        const userId  = new ObjectId(req.params.userId);
        const user = await Users.findOne({ "_id":userId,"deletedAt" : null }).select('-password');
       try{
            // if(user && user.deletedAt == null)
            if(user){
                res.res.status(200).send({
                    status:'ok',
                    data:user
                })
            }else{
                res.status(422).send({
                    status:"Unprocessable Entity",
                    msg:"No users found with id : "+ userId
                })
            }
       }catch(error){
            res.status(500).send({
                status:'Internal Server Error',
                msg:"error while getting user with id : "+ userId
            })
       }
    },

    async createUser(req,res){
        const newuser = req.body;
        const {email,phone} = req.body;
        const userEmail = await Users.findOne({email});
        const userPhone = await Users.findOne({phone});
        console.log(userEmail)
        try{
            if(userEmail && userEmail.deletedAt != null && userPhone && userPhone.deletedAt != null){
                userEmail.deletedAt = null;
                userEmail.password = newuser.password
                await userEmail.save();
                res.status(200).send({
                    status:'ok',
                    msg:"User created"
                })
            }else{
                if(userEmail){
                    res.status(422).send({
                        status:"Unprocessable Entity",
                        msg:"User with this email already exists"
                    })
                }else if(userPhone){
                    res.status(422).send({
                        status:"Unprocessable Entity",
                        msg:"User with this phone already exists"
                    })
                }else{
                    const user  = new Users(newuser)
                    await user.save((error=>{
                        if(error){
                            console.log(error)
                            res.status(422).send({
                                status:'Unprocessable Entity',
                                msg:'creating user Failed, try again'
                            })
                        }else{
                            res.status(200).send({
                                status:'ok',
                                msg:"User created"
                            })
                        }
                    }));
                }
            }
            
        }catch(err){
            return res.status(500).send({
                status:'Internal Server Error',
                msg:"error while creating a user"
            })    
        }
    },

    async deleteUser(req,res){
        const userId  = new ObjectId(req.params.userId);
        const user = await Users.findOne({ "_id":userId });
       try{
            if(user){
                if(user.deletedAt == null){
                    user.deletedAt = new Date();
                    await user.save();
                    res.status(200).send({
                        status:"ok",
                        data:"User deleted"
                    })
                }else{
                    res.status(422).send({
                        status:"Unprocessable Entity",
                        msg:"user does not exists"
                    })
                }
                
            }else{
                res.status(422).send({
                    status:"Unprocessable Entity",
                    msg:"user not deleted"
                })
            }
       }catch(error){
        return res.status(500).send({
            status:'Internal Server Error',
            msg:"error while deleting a user"
        }) 
       }
    },

    async updateUser(req,res){
        // const userId  = req.params.userId;
        const userId  = new ObjectId(req.params.userId);

        // const hashedPassword = await utils.hashedPassword(req.body.password)
        // const user = await Users.findOne({ "_id":userId }).select('name email phone deletedAt');
        if(req.body.password){
            return res.status(400).send({
                status:'Bad Request',
                msg:"can not update user password here"
            })    
        }else{
            await user.findOneAndUpdate({_id:userId,deletedAt:null}, 
                {
                  
                    name: req.body.name,
                    email: req.body.email,
                    phone : req.body.phone,
                    // password: hashedPassword,
                    updatedAt: new Date()
                },
                {
                  multi: true
                }).then(data => {
                    if(!data) {
                        return res.status(422).send({
                            status:"Unprocessable Entity",
                            msg:"user not found with id " + req.params.userId
                        })
                    }
                    res.status(200).send({
                        status:'ok',
                        msg:"User updated"
                    })
                }).catch(err => {
                    if(err.kind === 'ObjectId') {
                        return res.status(400).send({
                            status:'Bad Request',
                            msg:"user not found with id " + req.params.userId
                        })               
                    }
                    return res.status(500).send({
                        status:'Internal Server Error',
                        msg:"Error updating user with id " + req.params.userId
                    })     
                })
        }
               
    }
}