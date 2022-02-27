const Route = require("express").Router();
const user = require("../models/userModel");
// const Auth = require("../routes/Auth");

// make friend
Route.post("/makeFrinend", (req, res) => {
	let { target_id, my_id } = req.body;
	user.findUser(my_id, (me) => {
		let isExist = me.friend.findIndex((res) => {
			return res.equals(target_id);
		});
		if (isExist == -1) {
			me.makeFriendTool(target_id);
			user.findUser(target_id, (friend) => {
				friend.makeFriendTool(my_id);
			});
			res.json({res:"success to make friend",me})
		} else {
			res.json({err:"此好友已經存在了"});
		}
	
	});
});

// delete friend
Route.post("/deleteFriend", (req, res) => {
	let { target_id, my_id } = req.body;
	user.findUser(my_id, (me) => {
		let friendIndex = me.friend.findIndex((res) => {
			return res.equals(target_id);
		});
		if(friendIndex == -1){
			res.json({err: "已刪除好友"}) 
			return
		} 
		me.friend.splice(friendIndex, 1);
		me.save();
		user.findUser(target_id, (Friend) => {
			let myIndex = Friend.friend.findIndex((res) => {
				return res.equals(my_id);
			});
			Friend.friend.splice(myIndex, 1);
			Friend.save();
			res.json({res: "success delete friend QQ , Good bye my friend !! Fxxk you",me})
		});
	});
});

// inquire friend info
Route.post("/find_all_friends", (req, res) => {
	user.findOne({ _id: req.body._id }, (err, User) => {
			if (err) {
				console.log(err);
			} else {
				if (User.friend.length == 0) {
					res.json({res:"no friend"});
					return
				} else {
					let all_friend_array = [];
					all_friend_array.push(User.friend);
					all_friend_array.sort((a, b) => {
						return b.Month_energy - a.Month_energy;
					});
					res.json({res:"success to get all friends",all_friend:all_friend_array});
				}

			}
		}).populate("friend");
});

Route.get("/find_all_users", (req, res) => {
	user.find({}, (err, User) => {
		if (err) {
			console.log(err);
		} else {
			if(User.length >= 50){
				User.slice(0,50)
			} 
			User.sort((a, b) => {
				return b.Month_energy - a.Month_energy;
			});
			console.log(User.length)
			res.json({res:"success find all users",allUser:User});
		}
	});
});

Route.post("/find_user",(req,res)=>{
	const {userId} =  req.body
	user.findOne({"user_ID":userId},(err,User)=>{
		if(err){
			console.log(err)
			return
		}
		if(!User){
			res.json({err:"找不到用戶"})
			return
		}
		res.json({res:"success to find User",User})
	})
})

module.exports = Route;
