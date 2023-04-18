import styles from "./styles.module.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Profile() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        window.location.href = "/"
    }

    const navigate = useNavigate()

    const editProfile = async () => {
        var userID = localStorage.getItem("user_id")
        const url = `http://localhost:8080/api/users/update/${userID}`

        var user = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: ""
        }

        let regexName = new RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$")
        let regexEmail = new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$")
        let regexPhoneNumber = new RegExp("^[0-9\-\+]{9,15}$")
        let regexPassword = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if (regexName.test(firstName) === true) {
            if (regexName.test(lastName) === true) {
                if (regexEmail.test(email) === true) {
                    if (regexPhoneNumber.test(phoneNumber) === true) {
                        if (regexPassword.test(password) === true || password === '') {
                            if (password === confirmPassword) {
                                user.firstName = firstName
                                user.lastName = lastName
                                user.email = email
                                user.phoneNumber = phoneNumber
                                user.password = password

                                try {
                                    const { user: res } = axios.post(url, user)
                                    alert("Zaktualizowano dane użytkownika")
                                    navigate("/")

                                } catch (error) {
                                    alert("catch")
                                    if (
                                        error.response &&
                                        error.response.status >= 400 &&
                                        error.response.status <= 500
                                    ) {
                                        setError(error.response.data.message)
                                    }
                                }
                            } else {
                                // setError("Hasła się nie zgadzają")
                                alert("Hasła się nie zgadzają")
                            }

                        } else {
                            // setError("Niepoprawne hasło")
                            alert("Niepoprawne hasło")
                        }
                    } else {
                        // setError("Niepoprawny numer telefonu")
                        alert("Niepoprawny numer telefonu")
                    }
                } else {
                    // setError("Niepoprawny adres e-mail")
                    alert("Niepoprawny adres e-mail")
                }
            } else {
                // setError("Niepoprawne nazwisko")
                alert("Niepoprawne nazwisko")
            }
        } else {
            // setError("Niepoprawne imię")
            alert("Niepoprawne imię")
        }
    }

    useEffect(() => {
        var userID = localStorage.getItem("user_id")
        axios.get(`http://localhost:8080/api/users/${userID}`).then((user) => {
            setFirstName(user.data.firstName)
            setLastName(user.data.lastName)
            setPhoneNumber(user.data.phoneNumber)
            setEmail(user.data.email)
            // setPassword(user.data.password)
        })
    }, [])

    return (
        <div>
            <nav className={styles.navbar}>
                <h1>Profil użytkownika</h1>
                <Link to="/">
                    <button type="button"
                        className={styles.white_btn}>
                        Strona główna
                    </button>
                </Link>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Wyloguj się
                </button>
            </nav>
            <h3 className={styles.center}>Edytuj dane profilowe</h3>
            <form className={styles.form_container} onSubmit={editProfile}>
                <div className={styles.section}>
                    <div className={styles.center}>
                        <div className={styles.special}>Imię: </div>
                        <input
                            type="text"
                            placeholder="Podaj imię"
                            name="firstName"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.center}>
                        <div className={styles.special}>Nazwisko: </div>
                        <input
                            type="text"
                            placeholder="Podaj nazwisko"
                            name="lastName"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.center}>
                        <div className={styles.special}>Numer telefonu: </div>
                        <input
                            type="text"
                            placeholder="Podaj numer telefonu"
                            name="phoneNumber"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.center}>
                        <div className={styles.special}>Adres e-mail: </div>
                        <input
                            type="text"
                            placeholder="Podaj email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.center}>
                        <div className={styles.special}>Hasło: </div>
                        <input
                            type="password"
                            placeholder="Wpisz nowe hasło"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.center}>
                        <div className={styles.special}>Powtórz hasło: </div>
                        <input
                            type="password"
                            placeholder="Powtórz hasło"
                            name="confirm_password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                </div>
                <div class={styles.center}>
                    <button
                        type="submit"
                        className={styles.green_btn}>
                        Edytuj dane
                    </button>
                </div>
                <div class={styles.center}>
                    {error && <div className={styles.error_msg}>{error}</div>}
                </div>
            </form>
        </div>
    )
}