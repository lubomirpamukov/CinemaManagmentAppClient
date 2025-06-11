import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, email } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navLogo}>
          CinemaWorld
        </Link>
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <Link to="/movies" className={styles.navLink}>
              Movies
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/schedule" className={styles.navLink}>
              Schedule
            </Link>
          </li>
          {isAuthenticated && (
            <li className={styles.navItem}>
              <Link to="/bookings" className={styles.navLink}>
                My Bookings
              </Link>
            </li>
          )}
        </ul>
        <div className={styles.navAuth}>
          {isAuthenticated ? (
            <>
              <span className={styles.welcomeUser}>{email}</span>
              <button onClick={logout} className={styles.authButton}>
                Logout
              </button>
            </>
          ) : (
            <React.Fragment>
              <Link to="/login" className={styles.authButton}>
              Login
            </Link>

             <Link to="/register" className={styles.authButton}>
              Register
            </Link>
            
            </React.Fragment>
           
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
