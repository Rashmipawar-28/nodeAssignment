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
                res.send({
                    type:true,
                    data:users
                })
            }else{
                res.send({
                    type:false,
                    msg:"No users found"
                })
            }
       }catch(error){
        res.send({
            type:false,
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
                res.send({
                    type:true,
                    data:user
                })
            }else{
                res.send({
                    type:false,
                    msg:"No users found"
                })
            }
       }catch(error){
        res.send({
            type:false,
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
                res.send({
                    type:true,
                    msg:"User created"
                })
            }else{
                if(userEmail){
                    res.send({
                        type:false,
                        msg:"User with this email already exists"
                    })
                }else if(userPhone){
                    res.send({
                        type:false,
                        msg:"User with this phone already exists"
                    })
                }else{
                    const user  = new Users(newuser)
                    await user.save((error=>{
                        if(error){
                            console.log(error)
                            res.send({
                                type:false,
                                msg:'creating user Failed, try again'
                            })
                        }else{
                            res.send({
                                type:true,
                                msg:"User created"
                            })
                        }
                    }));
                }
            }
            
        }catch(err){
            res.send({
                type:false,
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
                    res.send({
                        type:true,
                        data:"User deleted"
                    })
                }else{
                    res.send({
                        type:false,
                        msg:"user does not exists"
                    })
                }
                
            }else{
                res.send({
                    type:false,
                    msg:"user not deleted"
                })
            }
       }catch(error){
        res.send({
            type:false,
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
            return res.send({
                type:false,
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
                        return res.send({
                            type:false,
                            msg:"user not found with id " + req.params.userId
                        })
                    }
                    res.send({
                        type:true,
                        msg:"User updated"
                    })
                }).catch(err => {
                    console.log(err)
                    if(err.kind === 'ObjectId') {
                        return res.send({
                            type:false,
                            msg:"user not found with id " + req.params.userId
                        })               
                    }
                    return res.send({
                        type:false,
                        msg:"Error updating user with id " + req.params.userId
                    })     
                })
        }
               
    }
}