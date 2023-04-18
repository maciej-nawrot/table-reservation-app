const router = require("express").Router()
const { Reservation, validate } = require("../models/reservation")

//dodanie rezerwacji
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send({ message: error.details[0].message })
        }
        await new Reservation({ ...req.body }).save()
        res.status(201).send({ message: "Utworzono rezerwacje" })
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
})

//pobranie wszystkich rezerwacji
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find()
        res.send(reservations)
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
});

//pobranie rezerwacji po id
router.get('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
        res.send(reservation)
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
});

//usunięcie rezerwacji po id
router.delete('/:id', async (req, res) => {
    const id = req.params.id

    try {
        await Reservation.findByIdAndDelete(id).exec()
        res.status(201).send({ message: "Usunięto rezerwację" })
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
});

module.exports = router
