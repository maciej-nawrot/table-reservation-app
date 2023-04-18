import styles from "./styles.module.css"
import { Link } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";
import moment from 'moment';

export default function ShowReservations() {
    const [table, setTable] = useState([])
    const [reservationsList, setReservationList] = useState([])
    const [isReservation, setIsReservation] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        window.location.href = "/"
    }

    const deleteReservation = async (id, tableNumber, reservNumber) => {
        axios.delete(`http://localhost:8080/api/reservations/${id}`)

        var response = await axios.get(`http://localhost:8080/api/tables/${tableNumber}`)
        var table = response.data[0]
        var tempTableCalendar = []
        table.tableCalendar.map((entry, key) => {
            if (entry.reservationID !== reservNumber) {
                tempTableCalendar.push(entry)
            }
        })
        setTable({ ...table, ["tableCalendar"]: tempTableCalendar })
        axios.post(`http://localhost:8080/api/tables/mod/${table._id}`, tempTableCalendar).then(() => {
            window.location.reload(true);
        })
    }

    const displayReservation = (id) => {
        axios.get(`http://localhost:8080/api/reservations/${id}`).then(() => {
        })
    }

    const reservationCheck = () => {
        setIsReservation(false)
        reservationsList.map((reservation, key) => {
            if (localStorage.getItem("user_id") === reservation.user_id) {
                setIsReservation(true)
            }
        })
    }

    function compare(a,b) {
        const temp1 = a.date.slice(0, 10)
        const temp2 = b.date.slice(0, 10)
        if(temp1 < temp2) return -1
        if(temp1 > temp2) return 1
        return 0
    }

    useEffect(() => {
        axios.get("http://localhost:8080/api/reservations").then((allReservations) => {
            // setReservationList(allReservations.data)
            const temp = allReservations.data.sort(compare)
            setReservationList(temp)
        })
    }, [])

    useEffect(() => {
        reservationCheck()
    })

    return (
        <div>
            <nav className={styles.navbar}>
                <h1>Moje rezerwacje</h1>
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

            <div className={styles.center}>
                {isReservation ?
                    <table className={styles.styledtable}>
                        <thead>
                            <tr>
                                <th>Numer rezerwacji</th>
                                <th>Numer stolika</th>
                                <th>Data rezerwacji</th>
                                <th>Początek rezerwacji</th>
                                <th>Koniec rezerwacji</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reservationsList.map((reservation, key) => (
                                    localStorage.getItem("user_id") === reservation.user_id ?
                                        (moment().format("YYYY-MM-DD") === reservation.date.slice(0, 10) && moment().format("HH:mm") >= reservation.beginningTime) 
                                        || (moment().format("YYYY-MM-DD") > reservation.date.slice(0, 10)) ?
                                            <tr reservation={styles.activerow} key={key}>
                                                <td>{reservation.number}</td>
                                                <td>{reservation.table_number}</td>
                                                <td>{reservation.date.split("", 10)}</td>
                                                <td>{reservation.beginningTime}</td>
                                                <td>{reservation.endingTime}</td>
                                                <td>Rezerwacja minęła</td>
                                            </tr>
                                            :
                                            <tr reservation={styles.activerow} key={key}>
                                                <td>{reservation.number}</td>
                                                <td>{reservation.table_number}</td>
                                                <td>{reservation.date.split("", 10)}</td>
                                                <td>{reservation.beginningTime}</td>
                                                <td>{reservation.endingTime}</td>
                                                <td>
                                                    <Link to={"/displayReservation/" + reservation._id}>
                                                        <button
                                                            className={styles.details_btn} onClick={() => displayReservation(reservation._id)}>
                                                            Szczegóły
                                                        </button>
                                                    </Link>
                                                    <button
                                                        className={styles.delete_btn} onClick={() => {
                                                            const confirmBox = window.confirm(
                                                                "Czy na pewno chcesz anulować tę rezerwację?"
                                                            )
                                                            if (confirmBox === true) {
                                                                deleteReservation(reservation._id, reservation.table_number, reservation.number)
                                                            }
                                                        }}>
                                                        Anuluj
                                                    </button>
                                                </td>
                                            </tr>
                                        :
                                        null
                                ))
                            }
                        </tbody>
                    </table>
                    : <div className={styles.header}>Brak rezerwacji</div>}
            </div>
        </div>
    )
}