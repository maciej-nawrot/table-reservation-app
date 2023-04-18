import styles from "./styles.module.css"
import { Link} from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import moment from 'moment';

export default function Tables() {

    const [tableList, setTableList] = useState([])
    const [reservationList, setReservationList] = useState([])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        window.location.href = "/"
    }

    function compare(a,b) {
        const temp1 = a.date.slice(0, 10)
        const temp2 = b.date.slice(0, 10)
        if(temp1 < temp2) return -1
        if(temp1 > temp2) return 1
        return 0
    }

    useEffect(() => {
        axios.get("http://localhost:8080/api/tables").then((allTables) => {
            setTableList(allTables.data)
        })

        axios.get("http://localhost:8080/api/reservations").then((allReservations) => {
            const temp = allReservations.data.sort(compare)
            setReservationList(temp)
        })
    }, [])

    return (
        <div>
            <nav className={styles.navbar}>
                <h1>Stoliki</h1>
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
            {tableList ?
                tableList.map((table, key) => (
                    <table className={styles.styledtable}>
                        <thead>
                            <tr>
                                <th>Numer stolika: {table.number}</th>
                                <th>Ilość miejsc: {table.seatsNumber}</th>
                                <th>Typ stolika: {table.type}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservationList ? reservationList.map((reservation, key2) => (
                                table.number === reservation.table_number && ((moment().format("YYYY-MM-DD") === reservation.date.slice(0, 10)
                                    && moment().format("HH:mm") < reservation.beginningTime) || (moment().format("YYYY-MM-DD") < reservation.date.slice(0, 10))) ?
                                    // table.number === reservation.table_number ?
                                    <tr className={styles.activerow}>
                                        <td colSpan="3">
                                            {reservation.date.slice(0, 10) + " " + reservation.beginningTime + " - " + reservation.endingTime
                                                + ", rezerwujący: " + reservation.firstName + " " + reservation.lastName}
                                        </td>
                                    </tr>
                                    : null
                            ))
                                : null
                            }

                        </tbody>
                    </table>))

                : null
            }
        </div>
    )
}