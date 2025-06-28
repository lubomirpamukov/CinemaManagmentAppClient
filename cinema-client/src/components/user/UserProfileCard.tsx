import React from "react";
import styles from "./UserProfileCard.module.css";
import type { TUser } from "../../validations";

type UserProfileCardProps = {
    user: TUser
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
    const { name, email, contact, address } = user;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.avatar}>{name ? name.charAt(0).toUpperCase() : "U"}</div>
                <h1 className={styles.name}>{name || "User"}</h1>
                <p className={styles.email}>{email}</p>
            </div>
            <div className={styles.details}>
                <h2 className={styles.subheading}>Contact Information</h2>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Contact Number</span>
                    <span className={styles.value}>{contact || "Not Provided"}</span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.label}>Address</span>
                    <span className={styles.value}>{address?.line1 || "Not Provided"}</span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.label}>City</span>
                    <span className={styles.value}>{address?.city || "Not Provided"}</span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.label}>State / Province</span>
                    <span className={styles.value}>{address?.state || "Not Provided"}</span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.label}> Zip Code</span>
                    <span className={styles.value}>{address?.zipcode || "Not Provided"}</span>
                </div>
            </div>
        </div>
    );
}

export default UserProfileCard;