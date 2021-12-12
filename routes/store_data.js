const Route = require("express").Router();
const study = require("../models/studyModel");
const user = require("../models/userModel")
const moment = require("moment");
const calMonth = require("../calcauletMonthEnergy")

// func
    // 計算將秒數轉為 XX:XX:XX 格式

function transSecondToFormat(sec){

    let studyTimeSeconds = ""
    let studyTimeMinutes = ""
    let studyTimeHours = ""

    if( sec > 60 ) {//如果秒數大於60，將秒數轉換成整數

        //獲取分鐘，除以60取整數，得到整數分鐘
        studyTimeMinutes = parseInt(sec / 60);
        //獲取秒數，秒數取佘，得到整數秒數
        studyTimeSeconds = parseInt(sec % 60);
        //如果分鐘大於60，將分鐘轉換成小時
        if(studyTimeMinutes > 60) {
            //獲取小時，獲取分鐘除以60，得到整數小時
            studyTimeHours = parseInt(studyTimeMinutes / 60);
            //獲取小時後取佘的分，獲取分鐘除以60取佘的分
            studyTimeMinutes = parseInt(studyTimeMinutes % 60);
        }
    }else{
        studyTimeSeconds = sec
    }

    // let studyTime = moment.utc(single_study_time*1000).format('HH:mm:ss');
    // 將秒數轉換成 HH:mm:ss

    let endTime =  moment().utc(sec*1000).format('YYYY/MM/DD HH:mm:ss')
    let startTime = moment().subtract({
        "hours": studyTimeHours ,
        "minutes": studyTimeMinutes,
        "seconds": studyTimeSeconds
    }).utc(sec*1000).format('YYYY/MM/DD HH:mm:ss')
    let energy = sec / 60

    return {
        endTime,
        startTime,
        energy

    }
}



// api
Route.post("/add_new_data",(req,res)=>{
        let {  single_study_time } = req.body

        // 取得 { endTime,startTime,energy }
        let timeData = transSecondToFormat(single_study_time)
        
        // 取得當月月份
        let getThisMonth = moment().get('month') + 1
        // 取得當年年份
        let getThisyear = moment().get('year')
        
        //取得startTime的月份
        let getStartTimeMonth = timeData.startTime.split("/",2)[1]
        //取得startTime的年份
        let getStartTimeyear = timeData.startTime.split("/",2)[0]



        // 是否與現在月份相同若有則只需加入一筆資料，若無(跨月問題)則要新增兩筆(當月、上月)，若無
        
        if(getThisMonth == getStartTimeMonth && getThisyear == getStartTimeyear){
            // 相同月份及年份的情況下
            study.create({
                "topic": req.body.todo,
                "start_study_time": timeData.startTime,
                "duration" : single_study_time,
                "end_study_time": timeData.endTime,
                "energy": timeData.energy,
                "user": req.body.userId
            },(err,data)=>{
                if(err){
                    console.log(err)
                }else{
                        user.findUser(req.body.userId,(User)=>{
                        User.all_energy += Number( single_study_time)/60
                        User.Month_energy += Number( single_study_time)/60
                        User.save()
                    })
                }
            })
            console.log("相同月份")
        }else{
            // 不同月份的情況下
                // 年份相同
                    // if( getThisyear == getStartTimeMonth){
                    //     studt.create({
                    //         "topic": req.body.todo,
                    //         "start_study_time": timeData.startTime.format('YYYY/MM/DD HH:mm:ss'),
                    //         "duration" : single_study_time,
                    //         "end_study_time": ``,
                    //         "energy": energy,
                    //         "user": req.body.userId
                    //     },(err,data)=>{
                    //         if(err){
                    //             console.log(err)
                    //         }else{
                                
                    //         }
                    //     })
                // 不同年份
                console.log(" 不同月份")
            }
        
        
    })

// 查找相同標籤資料


// 取得能量經驗值(總)

Route.post("/getEnergy",(req,res)=>{
    let { _id } = req.body
    user.findUser(_id,(User)=>{
        let sum = 0
        User.all_study_info.forEach ((item)=>{
            sum += Number(item.energy)
        })
    res.send(String(sum))
        
    })
    // console.log(_id)
})

//取得能量經驗值(當月)

Route.post("/getMonthEnergy",(req,res)=>{
    calMonth(req.body)
})

// 讀書時使用


// 刪除資料表
// Route.get("/delete",(req,res)=>{
//     study.remove({},(err,data)=>{
//         if(err){
//             console.log(err)
//         }else{
//             console.log(data)
//         }
//     })
// })


module.exports = Route