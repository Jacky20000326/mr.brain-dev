const joi = require("joi");

const userSchema = (data)=>{

    let schema = joi.object({
        email: joi.string().email({
            minDomainSegments: 2
        }).required(),
        password: joi.string().min(6).max(30).required()
    })

    return schema.validate(data)
        
}

module.exports.userSchema = userSchema
