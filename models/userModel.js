const mongoose = require("mongoose");
const study_Model = require("./studyModel")


const userSchema = new mongoose.Schema({
    user_ID:{
        type: String,
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    name:{
        type: String,
        require: true
    },
    friend: [{
        type : mongoose.Types.ObjectId,
        ref: "User"
    }],
    all_study_info: [{
        type : mongoose.Types.ObjectId,
        ref: study_Model
    }],
    level: {
        type: String,
        require: true
    },
    bulb:{
        type: String,
        require: true
    },
    all_energy:{
        type: Number,
        require: true
    },
    Month_energy: {
        type: String,
        require: true
    },
    Founding_time:{
        type: String,
        require: true
    }
    // 新增總能量
})

// find db have same user or not
userSchema.statics.findSameInfoIndb = function(user,callback){
    this.findOne({"email": user.email},(err,User)=>{
        if(err){
            console.log(err)
            return
        }
        callback(User)
    })
}

// make friend with other user
userSchema.statics.findUser = function(userID,callback){
    this.findOne({"_id":userID},(err,otherUser)=>{
        if(err){
            console.log(err)
        }
        if(otherUser){
            callback(otherUser)
        }else{
            console.log("Cannot find this user")
        }
    }).populate("all_study_info")
}

// 好友加入動態方法
userSchema.methods.makeFriendTool = function(userId){
    this.friend.push(userId)
    this.save()
}


const User = mongoose.model("User",userSchema)
module.exports = User