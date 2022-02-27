// jwt 驗證
const api = require("express").Router();
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
api.post('/authenticate',(req,res)=>{
        console.log(req.body)
        var token = req.body.token
        // 可能從userDefault來的
        if(token){
            jwt.verify(token,process.env.JWTSCRET,(err,decoded)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to authenticate token.'})
                }else{
                   

                    User.findUser(decoded._id,(user)=>{
                        res.json({decoded,state:"success authenticate token",user})
                    })
                }
            })
        }else{
            res.json({err:"使用者有儲存過token"})
        }
    })

module.exports = api