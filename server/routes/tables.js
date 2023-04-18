const router = require("express").Router()
const { Table, validate } = require("../models/table")

//dodanie stolika
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send({ message: error.details[0].message })
        }
        await new Table({ ...req.body }).save()
        res.status(201).send({ message: "Utworzono stolik" })
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
})

//aktualizacja stolika po id
router.post("/:id", async (req, res) => {
    try {
        const { error } = validate(req.body)
        const table = await Table.findById(req.params.id)

        table.number = req.body.number
        table.seatsNumber = req.body.seatsNumber
        table.tableCalendar = req.body.tableCalendar
        table.save()
        res.status(201).send({ message: "Zaktualizowano stolik" })
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
})

//usunięcie anulowanej rezerwacji z kalendarza
router.post("/mod/:id", async (req, res) => {
    try {
        const table = await Table.findById(req.params.id)
        table.tableCalendar = req.body
        table.save()
        res.status(201).send({ message: "Usunięto rezerwację z kalendarza" })
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
})

//pobranie wszystkich stolików
router.get('/', async (req, res) => {
    try {
        const tables = await Table.find()
        res.send(tables)
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
});

//pobranie numeru stolika
router.get('/name/:id', async (req, res) => {
    try {
        const tables = await Table.find({ _id: req.params.id }, { _id: 0, number: 1 })
        res.send(tables)
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
});

//pobranie całego stolika po jego numerze
router.get('/:number', async (req, res) => {
    try {
        const tables = await Table.find({ number: req.params.number })
        res.send(tables)
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
});

//usunięcie stolika po id
router.delete('/:id', async (req, res) => {
    const id = req.params.id

    try {
        await Table.findByIdAndDelete(id).exec()
        res.status(201).send({ message: "Usunięto stolik" })
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
});

module.exports = router
