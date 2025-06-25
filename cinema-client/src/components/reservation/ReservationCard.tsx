import React from "react";
import type { TReservationDisplay } from "../../validations";
import styles from "./ReservationCard.module.css";

type ReservationCardProps = {
    reservation: TReservationDisplay;
    actions?: React.ReactNode;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
    reservation,
    actions
}) => {
    return (
        <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.movie}>{reservation.movieName}</span>
        <span className={styles.status} data-status={reservation.status}>
          {reservation.status}
        </span>
      </div>
      <div className={styles.details}>
        <div>
          <strong>Reservation Code:</strong> {reservation.reservationCode}
        </div>
        <div>
          <strong>Date:</strong>{" "}
          {new Date(
            `${reservation.sessionDate}T${reservation.sessionStartTime}`
          ).toLocaleString()}
        </div>
        <div>
          <strong>Hall:</strong> {reservation.hallName}
        </div>
        <div>
          <strong>Seats:</strong>{" "}
          {reservation.seats.map((seat) => seat.seatNumber).join(", ")}
        </div>
        {reservation.purchasedSnacks.length > 0 && (
          <div>
            <strong>Snacks:</strong>{" "}
            {reservation.purchasedSnacks
              .map((snack) => `${snack.name} x${snack.quantity}`)
              .join(", ")}
          </div>
        )}
        <div className={styles.price}>
          <strong>Total:</strong> {reservation.totalPrice.toFixed(2)} BGN
        </div>
      </div>
      {/* Render any action buttons passed from the parent */}
      {actions && <div className={styles.actionsContainer}>{actions}</div>}
    </div>
    )
}

export default ReservationCard;