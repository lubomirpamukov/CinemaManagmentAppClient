import React from "react";
import styles from "./ConfirmReservationStep.module.css";
import type { THallSeat } from "../../validations";
import type { SelectedSnackInfo } from "./SelectCinemaAndSnacksStep";

type Props = {
  movieName?: string;
  cinemaName?: string;
  hallName?: string;
  date?: Date | null | undefined;
  sessionTime?: string;
  selectedSeats?: THallSeat[];
  selectedSnacks?: Record<string, SelectedSnackInfo>;
  onConfirm?: () => void;
  totalTicketPrice?: number;
};

const ConfirmReservation: React.FC<Props> = ({
  movieName,
  cinemaName,
  hallName,
  date,
  sessionTime,
  selectedSeats,
  selectedSnacks,
  onConfirm,
  totalTicketPrice,
}) => {
  const snackTotal = Object.values(selectedSnacks!).reduce(
    (sum, snack) => sum + snack.price * snack.quantity,
    0
  );
  const totalPrice = (totalTicketPrice! + snackTotal).toFixed(2);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Confirm Your Reservation</h2>
      <div className={styles.section}>
        <div className={styles.label}>Movie:</div>
        <div className={styles.value}>{movieName}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>Cinema:</div>
        <div className={styles.value}>{cinemaName}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>Hall:</div>
        <div className={styles.value}>{hallName}</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>Date & Time:</div>
        <div className={styles.value}>
          {date && date.toLocaleDateString()}
          {date && sessionTime ? ` – ${sessionTime}` : sessionTime || ""}
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>Seats:</div>
        <div className={styles.value}>
          {(selectedSeats ?? []).map((seat) => seat.seatNumber).join(", ")}
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>Tickets Price:</div>
        <div className={styles.value}>{totalTicketPrice} BGN</div>
      </div>
      <div className={styles.section}>
        <div className={styles.label}>Snacks:</div>
        <div className={styles.value}>
          {Object.values(selectedSnacks ?? []).length === 0 ? (
            "None"
          ) : (
            <ul className={styles.snackList}>
              {Object.values(selectedSnacks ?? []).map((snack) => (
                <li key={snack._id}>
                  {snack.name} x{snack.quantity} –{" "}
                  {snack.price * snack.quantity} BGN
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.totalSection}>
        <span>Total Price:</span>
        <span className={styles.totalPrice}>{totalPrice} BGN</span>
      </div>
      <button className={styles.confirmButton} onClick={onConfirm}>
        Confirm Reservation
      </button>
    </div>
  );
};

export default ConfirmReservation;
