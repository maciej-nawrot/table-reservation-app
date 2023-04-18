import { Route, Routes, Navigate } from "react-router-dom"
import Main from "./components/Main"
import Signup from "./components/Signup"
import Login from "./components/Login"
import MakeReservation from "./components/MakeReservation"
import MyReservations from "./components/MyReservations"
import DisplayReservation from "./components/DisplayReservation"
import Profile from "./components/Profile"
import Tables from "./components/Tables"

function App() {
  const user = localStorage.getItem("token")
  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/makeReservation" exact element={<MakeReservation />} />
      <Route path="/myReservations" exact element={<MyReservations />} />
      <Route path="/displayReservation/:id" exact element={<DisplayReservation />} />
      <Route path="/profile" exact element={<Profile />} />
      <Route path="/tables" exact element={<Tables />}/>
    </Routes>
  )
}

export default App;
