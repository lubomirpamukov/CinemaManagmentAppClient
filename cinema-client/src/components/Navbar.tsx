import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../hooks";
import { FaShoppingCart } from "react-icons/fa";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();

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

          {isAuthenticated && (
            <li className={styles.navItem}>
              <Link to="/bookings" className={styles.navLink}>
                My Bookings
              </Link>
            </li>
          )}
        </ul>
        <div className={styles.navAuth}>
          {isAuthenticated && (
            <li className={styles.navItem}>
              <Link to="/cart" className={styles.navLink}>
                <FaShoppingCart size={22} />
              </Link>
            </li>
          )}
          {isAuthenticated ? (
            <>
              <Link to="my-profile" className={styles.welcomeUser}>
                {user?.name ? user?.name : user?.email}
              </Link>
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
