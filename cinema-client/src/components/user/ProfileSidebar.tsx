import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./ProfileSidebar.module.css";

const ProfileSidebar: React.FC = () => {
  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navList}>

        <li className={styles.navItem}>
          <NavLink
            to="/my-profile/bookings"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            My Bookings
          </NavLink>
        </li>
        
        <li className={styles.navItem}>
          <NavLink
            to="/my-profile/details"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Update Details
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/my-profile/password"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Change Password
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileSidebar;
