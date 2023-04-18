import styles from "./styles.module.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";

export default function ShowReservations() {
    const [table, setTable] = useState()
    const [reservationInfo, setReservationInfo] = useState()
    const reservationID = window.location.href.slice(-24)

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        window.location.href = "/"
    }

    const navigate = useNavigate()

    const deleteReservation = (id) => {
        axios.delete(`http://localhost:8080/api/reservations/${id}`)
        var tempTableCalendar = []

        table.tableCalendar.map((entry, key) => {
            if (entry.reservationID !== reservationInfo.number) {
                tempTableCalendar.push(entry)
            }
        })
        setTable({ ...table, ["tableCalendar"]: tempTableCalendar })

        axios.post(`http://localhost:8080/api/tables/mod/${table._id}`, tempTableCalendar).then(() => {
            navigate("/myReservations")
        })
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/api/reservations/${reservationID}`).then((reserv) => {
            setReservationInfo(reserv.data)
            axios.get(`http://localhost:8080/api/tables/${reserv.data.table_number}`).then((table) => {
                setTable(table.data[0])
            })
        })
    }, [])

    return (
        reservationInfo !== undefined ?
            <div>
                <nav className={styles.navbar}>
                    <h1>Szczegóły rezerwacji</h1>
                    <Link to="/myReservations">
                        <button type="button"
                            className={styles.white_btn}>
                            Powrót
                        </button>
                    </Link>
                    <button className={styles.white_btn} onClick={handleLogout}>
                        Wyloguj się
                    </button>
                </nav>

                <div>
                    <h2 className={styles.center}>Numer rezerwacji: {reservationInfo.number}</h2>
                    <div className={styles.center}>Numer stolika: {reservationInfo.table_number}</div>
                    <div className={styles.center}>Data rezerwacji: {reservationInfo.date.split("", 10)}</div>
                    <div className={styles.center}>Godzina rozpoczęcia: {reservationInfo.beginningTime}</div>
                    <div className={styles.center}>Godzina zakończenia: {reservationInfo.endingTime}</div>
                    <div className={styles.center}>Imię osoby rezerwującej: {reservationInfo.firstName}</div>
                    <div className={styles.center}>Nazwisko osoby rezerwującej: {reservationInfo.lastName}</div>
                    <div className={styles.center}>Numer telefonu: {reservationInfo.phoneNumber}</div>

                    <div className={styles.center}>
                        <button
                            className={styles.red_btn} onClick={() => {
                                const confirmBox = window.confirm(
                                    "Czy na pewno chcesz anulować tę rezerwację?"
                                )
                                if (confirmBox === true) {
                                    deleteReservation(reservationInfo._id)
                                }
                            }
                            }>
                            Anuluj rezerwację
                        </button>
                    </div>
                </div>
            </div>
            :
            <div></div>
    )
}