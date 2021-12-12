const user = require("./models/userModel");
const moment = require("moment");

const calculateMouthEnergy = (id)=>{
    let { userId } = id
    user.findUser(userId,(User)=>{
        let sum = 0
        let getThisMonth = moment().get('month') + 1
        User.all_study_info.forEach ((item)=>{
            let getStudtMonth = item.start_study_time.split("/",2)[1]
            if(getStudtMonth == getThisMonth){
                sum += Number(item.energy)
                console.log(User)
            }else{
                console.log("no match")
            }
        })
        User.Month_energy = sum
        User.save()
    })
}

module.exports = calculateMouthEnergy