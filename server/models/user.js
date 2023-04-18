const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")

//model użytkownika
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true }
})
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "2h",
    })
    return token
}
const User = mongoose.model("User", userSchema)
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required()
            .pattern(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/)
            .label("First Name").messages({
                "string.pattern.base": "Nieprawidłowe imię"
            }),
        lastName: Joi.string().required()
        .pattern(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/)
        .label("Last Name").messages({
            "string.pattern.base": "Nieprawidłowe nazwisko"
        }),
        email: Joi.string().email().required().label("E-mail").messages({"string.email": "Nieprawidłowy e-mail"}),
        password: passwordComplexity().required().label("Password").messages({
            "passwordComplexity.tooShort": "Hasło jest za krótkie (minimum 8 znaków)",
            'passwordComplexity.lowercase': "Hasło powinno zawierać przynajmniej jedną małą literę",
            'passwordComplexity.uppercase': "Hasło powinno zawierać przynajmniej jedną wielką literę",
            'passwordComplexity.numeric': "Hasło powinno zawierać przynajmniej jedną cyfrę",
            'passwordComplexity.symbol': "Hasło powinno zawierać przynajmniej jeden znak specjalny"
        }),
        phoneNumber: Joi.string().length(9).pattern(/^[0-9]+$/).required().label("Phone Number").messages({
            "string.pattern.base": "Nieprawidłowy numer telefonu",
            "string.length": "Numer telefonu musi posiadać 9 cyfr"
        })
    })
    return schema.validate(data)
}

module.exports = { User, validate }