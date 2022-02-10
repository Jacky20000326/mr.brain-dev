const Route = require("express").Router();
const joiSchema = require("../joiUserSchena").userSchema;
const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");

const study = require("../models/studyModel");

// 可以使用userdefault來存放使用者資訊 ex.使用者ID、賬號、密碼、暱稱等

// global：在 Node.js 下的全域名稱

//localhost:3002/api/auth/sign-up
// 註冊
http: Route.post("/sign-up", (req, res) => {
	let typingError = joiSchema(req.body);
	if (!typingError.error) {
		user.findSameInfoIndb(req.body, (User) => {
			if (!User) {
				bcrypt.genSalt(saltRounds, function (err, salt) {
					bcrypt.hash(req.body.password, salt, function (err, hash) {
						if (err) {
							next(err);
						}
						user.create(
							{
								email: req.body.email,
								password: hash,
								all_energy: 0,
								Month_energy: 0,
								level: "level1",
								bulb: "bulb1",
							},
							(err, result) => {
								if (err) {
									console.log(err);
								} else {
									user.generateId(result);
									console.log(result);
									res.send("success");
								}
							}
						);
					});
				});
			} else {
				res.send("這個email已經被註冊過了");
			}
		});
	} else {
		res.send(typingError.error.details[0].message);
	}
});

// 登入
Route.post("/log-in", (req, res) => {
	let typingError = joiSchema(req.body);
	if (!typingError.error) {
		user.findSameInfoIndb(req.body, (User) => {
			if (User) {
				bcrypt.compare(
					req.body.password,
					User.password,
					function (err, ismatch) {
						if (err) {
							console.log(err);
							return;
						}
						if (ismatch == true) {
							let userInfo = [];
							let state = "success";
							let payload = { email: User.email };
							let token = jwt.sign(payload, process.env.JWTSCRET);
							userInfo.push(User);
							// user_Info.push(User)
							res.json({ userInfo, token, state });
							console.log("已登入");
						} else {
							res.send("password is not correct");
							console.log("你的密碼不正確喔!!");
						}
					}
				);
			} else {
				console.log("沒有這位使用者");
				res.send("cannot find the user");
			}
		});
	} else {
		console.log(typingError.error.details[0].message);
	}
});

// 使用者加入名稱
Route.post("/save-name", (req, res) => {
	user.findUser(req.body._id, (User) => {
		User.name = req.body.name;
		User.save();
	});
	console.log(req.body);
});

Route.post("/getUserInfo", (req, res) => {
	user.findOne({ _id: req.body._id }, (err, User) => {
		if (err) {
			console.log(err);
		}
		if (!User) {
			console.log("It's wrong id");
		} else {
			res.send(User);
		}
	});
});

// 取得所有會員資料
Route.get("/cms/getUserInfo", (req, res) => {
	user.find({}, (err, allUser) => {
		if (err) {
			console.log(err);
		} else {
			res.json(allUser);
		}
	});
});

// delete all user

// Route.get('/delete',(req,res)=>{
//     study.remove({},(err,Data)=>{
//         if (err) {
//             console.log(err)
//         }else{
//             console.log(Data)
//         }
//     })
// })
module.exports = Route;
