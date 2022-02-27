const mongoose = require("mongoose");


const studySchema = new mongoose.Schema({
    topic:{
        type: String,
        require: true,
        max: 50,
    },
    duration:{
        type: String,
        require: true
    },
    start_study_time: {
        type: String,
    },
    end_study_time:{
        type: String,
    },
    energy: {
        type: String,
        require: true
    },
    user:{
        type: String,
        require: true
    }
})




const Study = mongoose.model('Study',studySchema)

module.exports = Study