const router = require("express").Router()
const { User, validate, validateProfile } = require("../models/user")
const bcrypt = require("bcrypt")

//rejestracja użytkownika
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const user = await User.findOne({ email: req.body.email })
        if (user)
            return res
                .status(409)
                .send({ message: "Użytkownik o takim emailu istnieje!" })
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        await new User({ ...req.body, password: hashPassword }).save()
        res.status(201).send({ message: "Utworzono użytkownika" })
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
})

//pobranie użytkowników
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
});

//pobranie użytkownika po id
router.get('/:id', async (req, res) => {
    try {
        const users = await User.findById(req.params.id)
        res.send(users)
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
});

//aktualizacja danych użytkownika
router.post("/update/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (user) {
            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            user.email = req.body.email
            user.phoneNumber = req.body.phoneNumber

            if (req.body.password !== '') {
                const salt = await bcrypt.genSalt(Number(process.env.SALT))
                const hashPassword = await bcrypt.hash(req.body.password, salt)
                user.password = hashPassword
            }
        
            await user.save().then(() => res.status(201).send({ message: "Uaktualniono użytkownika" }))
        }
    } catch (error) {
        res.status(500).send({ message: "Błędne dane" })
    }
})

module.exports = router
