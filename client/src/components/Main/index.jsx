import styles from "./styles.module.css"
import { Link } from "react-router-dom"
const Main = () => {
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        window.location.href = "/"
    }

    return (
        <div>
            <nav className={styles.navbar}>
                <h1>Strona główna</h1>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Wyloguj się
                </button>
            </nav>

            <div className={styles.center}>
                <Link to="/profile">
                    <button type="button"
                        className={styles.green_btn}>
                        Profil
                    </button>
                </Link>
            </div>

            <div className={styles.center}>
                <Link to="/makeReservation">
                    <button type="button"
                        className={styles.green_btn}>
                        Zarezerwuj stolik
                    </button>
                </Link>
            </div>

            <div className={styles.center}>
                <Link to="/myReservations">
                    <button type="button"
                        className={styles.green_btn}>
                        Moje rezerwacje
                    </button>
                </Link>
            </div>

            <div className={styles.center}>
                <Link to="/tables">
                    <button type="button"
                        className={styles.green_btn}>
                        Stoliki
                    </button>
                </Link>
            </div>
        </div>
    )
}
export default Main