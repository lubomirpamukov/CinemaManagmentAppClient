import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MoviePage from "./pages/MoviesPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css";

function App() {
  return (
  <BrowserRouter>
   <AuthProvider>
    <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/movies" element={<MoviePage/>}/>
        <Route path="/booking/:movieId" element={<BookingPage/>}/>
        <Route path="/bookings" element={<MyBookingsPage/>}/>
      </Routes>
  </AuthProvider>
  </BrowserRouter>
 
  )
  }

export default App;
