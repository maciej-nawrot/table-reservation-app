const mongoose = require('mongoose');
const Joi = require("joi");
const Schema = mongoose.Schema;

//model kalendarza stolika (dokonane na dany stolik rezerwacje)
const tableCalendarSchema = new Schema({
    reservationID: {
        type: String
    },
    date: {
        type: Date,
    },
    hour: {
        type: String,
    }
})

//model stolika
const tableSchema = new Schema({
    number: {
        type: Number,
        required: true
    },
    seatsNumber: {
        type: Number,
        trim: true
    },
    type: {
        type: String,
        required: true,
    },
    tableCalendar: [tableCalendarSchema]
}, { timestamps: true })

const Table = mongoose.model("Table", tableSchema);
const validate = (data) => {
    const schema = Joi.object({
        number: Joi.number().required().label("Table number"),
        seatsNumber: Joi.number().required().label("Number of seats"),
        type: Joi.string().required().label("Table type"),
    })
    return schema.validate(data)
}
module.exports = { Table, validate };