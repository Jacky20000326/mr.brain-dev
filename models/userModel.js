const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	user_ID: {
		type: String,
	},
	email: {
		type: String,
		require: true,
	},
	password: {
		type: String,
		require: true,
	},
	name: {
		type: String,
		require: true,
	},
	friend: [
		{
			type: mongoose.Types.ObjectId,
			ref: "User",
		},
	],
	level: {
		type: String,
		require: true,
	},
	bulb: {
		type: String,
		require: true,
	},
	all_energy: {
		type: Number,
		require: true,
	},
	Month_energy: {
		type: Number,
		require: true,
	},
	Founding_time: {
		type: String,
		require: true,
	},
	// 新增總能量
});

// find db have same user or not
userSchema.statics.findSameInfoIndb = function (user, callback) {
	this.findOne({ email: user.email }, (err, User) => {
		if (err) {
			console.log(err);
			return;
		}
		callback(User);
	});
};

// make friend with other user
userSchema.statics.findUser = function (userID, callback) {
	this.findOne({ _id: userID }, (err, otherUser) => {
		if (err) {
			console.log(err);
		}
		if (otherUser) {
			callback(otherUser);
		} else {
			res.json({err:"找不到用戶"})
		}
	}).populate("all_study_info");
};

// 好友加入動態方法
userSchema.methods.makeFriendTool = function (userId) {
	this.friend.push(userId);
	this.save();
};

// 註冊時產生id(易讀)
userSchema.statics.generateId = function (user) {
	let randomSixNumber = Math.random().toString(36).substring(2, 8);
	this.findOne({ user_ID: randomSixNumber }, (err, exist) => {
		if (err) {
			console.log(err);
		} else {
			if (exist) {
				let newRendomNumberNumber = String(Number(randomSixNumber) + 1);
				user.user_ID = newRendomNumberNumber;
				user.save();
			} else {
				user.user_ID = randomSixNumber;
				user.save();
			}
		}
	});
};

const User = mongoose.model("User", userSchema);
module.exports = User;
