import React from "react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import styles from "./ProfilePage.module.css";
import ProfileSidebar from "../components/user/ProfileSidebar";
import UserProfileCard from "../components/user/UserProfileCard"; // 1. Import the card
import { Outlet } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className={styles.pageLoader}>
        <Spinner size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Dashboard</h1>
      <div className={styles.layout}>
        {/* 1. Create a dedicated left column */}
        <div className={styles.leftColumn}>
          <ProfileSidebar />
          <UserProfileCard user={user} />
        </div>

        {/* 2. The main content area will now be the right column */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
