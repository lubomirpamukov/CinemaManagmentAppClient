import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
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
      </Routes>
  </AuthProvider>
  </BrowserRouter>
 
  )
  }

export default App;
