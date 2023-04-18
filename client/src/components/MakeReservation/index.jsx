import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import styles from "./styles.module.css"
import TimePicker from "rc-time-picker";
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

const Main = () => {

    //wylogowanie się
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        window.location.href = "/"
    }

    //dane do rezerwacji
    const [data, setData] = useState({
        table_number: "",
        user_id: "",
        beginningTime: "",
        endingTime: "",
        number: "",
        date: ""
    })
    const [error, setError] = useState(""); //informacja o błędach przy wypełnianiu pierwszego formularza
    const [error2, setError2] = useState(""); //informacja o błędach przy wypełnianiu drugiego formularza
    const [Begtime, setBegTime] = useState("13:00"); //godzina rozpoczęcia rezerwacji
    const [Endtime, setEndTime] = useState("13:15"); //godzina zakończenia rezerwacji
    const [Submitted, setSubmitted] = useState(false); //informacja o tym czy przycisk wyszukania stolika został wciśnięty
    const [TablesList, setTablesList] = useState(''); //lista wszystkich stolików
    const [TablesThatMatch, setTablesThatMatch] = useState([]); //wolne stoliki do rezerwacji
    const [ChosenTable, setChosenTable] = useState(); //wybrany stolik przez użytkownika do rezerwacji
    const [FirstName, setFirstName] = useState(); //imię osoby rezerwującej
    const [LastName, setLastName] = useState(); //nazwisko osoby rezerwującej
    const [PhoneNumber, setPhoneNumber] = useState(); //numer telefonu osoby rezerwującej

    const navigate = useNavigate()

    //zmiana daty w pierwszym formularzu
    const handleChange = ({ currentTarget: input }) => {
        setSubmitted(false)
        setChosenTable(undefined)
        setData({ ...data, [input.name]: input.value })
    }

    //wciśnięcie przycisku wyszukania stolika
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setTablesThatMatch([])
        try {
            const url = "http://localhost:8080/api/tables"
            const { data: res } = await axios.get(url, data)
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message)
            }
        } finally {
            if (moment().format("YYYY-MM-DD") === data.date && moment().format("HH:mm") > Begtime) {
                setError("Data i godzina rozpoczęcia musi być późniejsza niż aktualna")
            } else {
                if (data.date !== "") {
                    setSubmitted(true)
                    var beginHour = parseInt(Begtime.slice(0, 2))
                    var beginMinute = parseInt(Begtime.slice(-2))
                    var endHour = parseInt(Endtime.slice(0, 2))
                    var endMinute = parseInt(Endtime.slice(-2))
                    var isValid = true
                    if (beginHour < endHour) {
                        if (endHour - beginHour > 2) {
                            setError("Przekroczono maksymalny czas rezerwacji (2 godziny)!")
                            isValid = false
                        } else if (endHour - beginHour === 2) {
                            if (endMinute > beginMinute) {
                                setError("Przekroczono maksymalny czas rezerwacji (2 godziny)!")
                                isValid = false
                            }
                        }
                    } else if (beginHour === endHour) {
                        if (beginMinute > endMinute) {
                            setError("Godzina rozpoczęcia nie może być późniejsza niż godzina zakończenia!")
                            isValid = false
                        }
                        if (beginMinute === endMinute) {
                            setError("Godzina rozpoczęcia nie może być tak sama jak godzina zakończenia!")
                            isValid = false
                        }
                    } else {
                        setError("Godzina rozpoczęcia nie może być późniejsza niż godzina zakończenia!")
                        isValid = false
                    }
                    if (isValid) {

                        //generowanie tablicy godzin trwania rezerwacji
                        var Beginhourminute = beginHour * 60 + beginMinute
                        var Endhourminute = endHour * 60 + endMinute
                        var tempTable = []
                        for (Beginhourminute; Beginhourminute <= Endhourminute; Beginhourminute += 15) {
                            var tempHour = parseInt(Beginhourminute / 60)
                            var tempMinute = Beginhourminute % 60
                            var timeString = ""
                            if (tempMinute === 0) {
                                timeString = (tempHour + ":" + tempMinute + "0")
                            } else {
                                timeString = (tempHour + ":" + tempMinute)
                            }
                            tempTable.push(timeString)
                        }
                        //mapowanie po stolikach (table - jeden stolik)
                        TablesList.map((table, key) => {
                            //pomocnicza tablica przechowująca zarezerwowane godziny
                            //w przypadku gdy data z formularza widnieje już w kalendarzu stolika
                            var tempReservatedHours = []
                            //mapowanie kalendarza danego stolika (v - wpis w kalendarzu)
                            table.tableCalendar.map((v, i) => {
                                //pobranie daty z kalendarza
                                var tempData = v.date.slice(0, 10)
                                //jeżeli data rezerwacji pobrana z formularza widnieje już w kalendarzu stolika
                                if (data.date === tempData) {
                                    //to dodaj godzinę rezerwacji do pomocniczej tablicy
                                    tempReservatedHours.push(v.hour)
                                }
                            })
                            //sprawdzenie czy godziny zarezerwowane zawierają się w godzinach widniejących w kalendarzu
                            var intersection = tempTable.filter(x => tempReservatedHours.includes(x))
                            //jeżeli się nie zawierają
                            if (intersection.length === 0) {
                                //to dodaj stolik do stolików wolnych do rezerwacji
                                setTablesThatMatch(TablesThatMatch => [...TablesThatMatch, table])
                            }
                        })
                    }
                }
            }

        }
    }

    //wciśnięcie przycisku do utworzenia rezerwacji
    const makeReservation = async (e) => {
        e.preventDefault();
        let regexName = new RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$")
        let regexPhoneNumber = new RegExp("^[0-9\-\+]{9,15}$")
        if (regexName.test(FirstName) === true) {
            if (regexName.test(LastName) === true) {
                if (regexPhoneNumber.test(PhoneNumber) === true) {
                    var reservation = {
                        table_number: "",
                        user_id: "",
                        beginningTime: "",
                        endingTime: "",
                        number: "",
                        date: "",
                        firstName: "",
                        lastName: "",
                        phoneNumber: ""
                    }
                    //utworzenie rezerwacji
                    reservation.table_number = ChosenTable.number
                    reservation.user_id = localStorage.getItem("user_id")
                    reservation.beginningTime = Begtime
                    reservation.endingTime = Endtime
                    reservation.number = Date.now().toString(32).slice(-4)
                    reservation.date = data.date
                    reservation.firstName = FirstName
                    reservation.lastName = LastName
                    reservation.phoneNumber = PhoneNumber
                    try {
                        const url = `http://localhost:8080/api/reservations`
                        const { reservation: res } = await axios.post(url, reservation)
                    } catch (error) {
                        if (
                            error.response &&
                            error.response.status >= 400 &&
                            error.response.status <= 500
                        ) {
                            setError2(error.response.data.message)
                        }
                    } finally {
                        //utworzenie wpisów do kalendarza stolika
                        var beginHour = parseInt(Begtime.slice(0, 2))
                        var beginMinute = parseInt(Begtime.slice(-2))
                        var endHour = parseInt(Endtime.slice(0, 2))
                        var endMinute = parseInt(Endtime.slice(-2))
                        var Beginhourminute = beginHour * 60 + beginMinute
                        var Endhourminute = endHour * 60 + endMinute
                        var tempTable = []
                        for (Beginhourminute; Beginhourminute <= Endhourminute; Beginhourminute += 15) {
                            var tempHour = parseInt(Beginhourminute / 60)
                            var tempMinute = Beginhourminute % 60
                            var timeString
                            if (tempMinute === 0) {
                                timeString = (tempHour + ":" + tempMinute + "0")
                            } else {
                                timeString = (tempHour + ":" + tempMinute)
                            }
                            tempTable.push(timeString)
                        }
                        var tempTableCalendar = ChosenTable.tableCalendar
                        tempTable.map((v, i) => {
                            var tempObj = { date: data.date.slice(0, 10), hour: v, reservationID: reservation.number }
                            tempTableCalendar.push(tempObj)
                        })
                        setChosenTable({ ...ChosenTable, ["tableCalendar"]: tempTableCalendar })

                        try {
                            const url = `http://localhost:8080/api/tables/` + ChosenTable._id
                            console.log(url)
                            const { ChosenTable: res } = await axios.post(url, ChosenTable)
                        } catch (error) {
                            if (
                                error.response &&
                                error.response.status >= 400 &&
                                error.response.status <= 500
                            ) {
                                setError2(error.response.data.message)
                            }
                        }
                        navigate("/")
                        alert("Zarezerwowano stolik")
                    }
                } else {
                    setError2("Niepoprawny numer telefonu")
                    return false
                }
            } else {
                setError2("Niepoprawne nazwisko")
                return false
            }
        } else {
            setError2("Niepoprawne imię")
            return false
        }

    }

    useEffect(() => {
        axios.get("http://localhost:8080/api/tables").then((allTables) => {
            setTablesList(allTables.data)
        })
        var userID = localStorage.getItem("user_id")
        axios.get(`http://localhost:8080/api/users/${userID}`).then((user) => {
            setFirstName(user.data.firstName)
            setLastName(user.data.lastName)
            setPhoneNumber(user.data.phoneNumber)
        })
    }, [])

    return (
        <div>
            <div>
                <nav className={styles.navbar}>
                    <h1>Zarezerwuj stolik</h1>
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
                <h2 className={styles.header}>1. Podaj czas rezerwacji:</h2>
                <form className={styles.form_container} onSubmit={handleSubmit}>
                    <div className={styles.section}>
                        <div className={styles.special}>Data rezerwacji:</div>
                        <input
                            type="date"
                            placeholder="Podaj datę utworzenia rezerwacji"
                            name="date"
                            onChange={handleChange}
                            value={data.date}
                            className={styles.input}
                            min={moment().format("YYYY-MM-DD")}
                            required
                        />

                        <div className={styles.center}>
                            <div className={styles.special}>Godzina rozpoczęcia: </div>
                            <div className={styles.input}>
                                <TimePicker
                                    placeholder="Wybierz godzinę rozpoczęcia"
                                    defaultValue={moment().set({ hour: 13, minute: 0 })}
                                    use12Hours={false}
                                    showSecond={false}
                                    focusOnOpen={true}
                                    disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 23]}
                                    minuteStep={15}
                                    onChange={e => {
                                        setBegTime(e.format('HH:mm'))
                                        setSubmitted(false)
                                        setChosenTable(undefined)
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.center}>
                            <div className={styles.special}>Godzina zakończenia: </div>
                            <div className={styles.input}>
                                <TimePicker
                                    placeholder="Wybierz godzinę zakończenia"
                                    defaultValue={moment().set({ hour: 13, minute: 15 })}
                                    use12Hours={false}
                                    showSecond={false}
                                    focusOnOpen={true}
                                    disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 23]}
                                    minuteStep={15}
                                    onChange={e => {
                                        setEndTime(e.format('HH:mm'))
                                        setSubmitted(false)
                                        setChosenTable(undefined)
                                    }}
                                />
                            </div>
                        </div>

                        <div class={styles.center}>
                            <button
                                type="submit"
                                className={styles.green_btn}>
                                Wyszukaj wolny stolik
                            </button>
                        </div>
                    </div>
                    <div class={styles.center}>
                        {error && <div className={styles.error_msg}>{error}</div>}
                    </div>
                    {Submitted && error === "" &&
                        <div>
                            {TablesThatMatch.length !== 0 ?
                                <div>
                                    <h2 className={styles.header}>2. Wybierz stolik:</h2>

                                    <div className={styles.section}>

                                        <table class={styles.styledtable}>
                                            <thead>
                                                <tr>
                                                    <th>Numer stolika</th>
                                                    <th>Liczba miejsc</th>
                                                    <th>Typ</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {TablesThatMatch.map((table, key) => (
                                                    <tr table={styles.activerow} key={key}>
                                                        <td>{table.number}</td>
                                                        <td>{table.seatsNumber}</td>
                                                        <td>{table.type}</td>
                                                        <td>
                                                            <button
                                                                className={styles.small_green_btn} onClick={() => {
                                                                    setChosenTable(table)
                                                                }}>
                                                                Wybierz stolik
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                : <div className={styles.info}>Brak wolnych stolików! Wybierz inną datę lub godzinę</div>}
                        </div>
                    }
                </form>
                {ChosenTable !== undefined ?
                    <div>
                        <form className={styles.form_container} onSubmit={makeReservation}>
                            <h2 className={styles.header}>3. Podaj dane do rezerwacji:</h2>
                            <div className={styles.section}>
                                <div className={styles.center}>
                                    <div className={styles.special}>Imię: </div>
                                    <input
                                        type="text"
                                        placeholder="Podaj imię"
                                        name="firstName"
                                        onChange={(e) => setFirstName(e.target.value)}
                                        value={FirstName}
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
                                        value={LastName}
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
                                        value={PhoneNumber}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>
                            <div class={styles.center}>
                                {error2 && <div className={styles.error_msg}>{error2}</div>}
                            </div>
                            <div class={styles.center}>
                                <button
                                    type="submit"
                                    className={styles.big_green_btn}>
                                    Zarezerwuj stolik
                                </button>
                            </div>
                        </form>
                    </div>
                    :
                    <div></div>
                }
            </div >
        </div >
    )
}
export default Main