const Route = require("express").Router();
const user = require("../models/userModel");
// const Auth = require("../routes/Auth");





// make friend
Route.post("/makeFrinend",(req,res)=>{
    let { target_id,my_id } = req.body
    user.findUser(my_id,(me) =>{
        let isExist = me.friend.findIndex((res)=>{
            return res.equals(target_id)
        })
        if(isExist == -1){
            me.makeFriendTool(target_id)
            user.findUser(target_id,(friend)=>{
                friend.makeFriendTool(my_id)
            })
        }else{
            console.log("此好友已經存在了")
        }
        console.log(me)
        console.log(isExist)
        console.log(req.body)
    })
})

// delete friend
Route.post("/deleteFriend",(req,res)=>{
    let { target_id,my_id } = req.body
    user.findUser(my_id,(me)=>{
        let friendIndex = me.friend.findIndex((res)=>{
            return res.equals(target_id) 
        })
        me.friend.splice(friendIndex,1)
        me.save()
        user.findUser(target_id,(Friend)=>{
            let myIndex = Friend.friend.findIndex((res)=>{
                return res.equals(my_id)
            })
            Friend.friend.splice(myIndex,1)
            Friend.save()
        })
       
    })
})

// inquire friend info
Route.post("/find_all_friends",(req,res)=>{
    user.findOne({"_id" : req.body.my_id},(err,user)=>{
        if(err){
            console.log(err)
        }else{
            console.log(user)
            res.json({user})
        }
    }).populate("friend")
    
})


module.exports = Route
