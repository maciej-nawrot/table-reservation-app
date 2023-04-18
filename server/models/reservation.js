const mongoose = require('mongoose');
const Joi = require("joi");
const Schema = mongoose.Schema;

//model rezerwacji stolika
const reservationSchema = new Schema({
    table_number: {
        type: Number,
        required: true,
    },
    user_id: {
        type: String,
        required: true
    },
    beginningTime: {
        type: String,
        required: true
    },
    endingTime: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
}, { timestamps: true })

const Reservation = mongoose.model("Reservation", reservationSchema);
const validate = (data) => {
    const schema = Joi.object({
        table_number: Joi.number().required().label("Table"),
        user_id: Joi.string().required().label("User"),
        beginningTime: Joi.string().required().label("Beginning time"),
        endingTime: Joi.string().required().label("Ending time"),
        number: Joi.string().required().label("Reservation number"),
        date: Joi.date().required().label("Date"),
        firstName: Joi.string().required().label("First name"),
        lastName: Joi.string().required().label("Last name"),
        phoneNumber: Joi.string().required().label("Phone number")
    })
    return schema.validate(data)
}
module.exports = { Reservation, validate };
