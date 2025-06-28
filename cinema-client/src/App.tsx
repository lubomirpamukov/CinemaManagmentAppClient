import { StrictMode } from "react";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MoviePage from "./pages/MoviesPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import UpdateDetailsPage from "./pages/UpdateDetailsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/movies" element={<MoviePage />} />
            <Route path="/booking/:movieId" element={<BookingPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/cart" element={<ShoppingCartPage />} />
            <Route path="/my-profile" element={<ProfilePage />}>
              <Route index element={<Navigate to="details" replace />} />
              <Route path="details" element={<UpdateDetailsPage />} />
              <Route path="password" element={<ChangePasswordPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;
