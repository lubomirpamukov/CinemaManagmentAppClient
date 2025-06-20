import React from "react";
import { useSessionSeatLayout } from "../../hooks";
import styles from "./SelectSeatsStep.module.css";
import type { TSeat } from "../../validations";
import Spinner from "../Spinner";

type Props = {
  sessionId: string;
  onSeatSelect?: (seat: TSeat) => void;
  selectedSeats?: string[];
};

const SelectSeatsStep: React.FC<Props> = ({
  sessionId,
  onSeatSelect,
  selectedSeats = [],
}) => {
  const { layout, loading, error } = useSessionSeatLayout(sessionId);

  if (loading) return <Spinner size="medium" />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!layout) return <div className={styles.status}>No layout found.</div>;

  const { hallLayout, seats, hallName } = layout;

  //Create 2D grid
  const grid: (TSeat | null)[][] = Array.from(
    { length: hallLayout.rows },
    (_, rowIdx) =>
      Array.from(
        { length: hallLayout.columns },
        (_, colIdx) =>
          seats.find(
            (seat) => seat.row === rowIdx + 1 && seat.column === colIdx + 1
          ) || null
      )
  );

  const totalPrice = seats
    .filter((seat) => selectedSeats.includes(seat._id || ""))
    .reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.hallName}>{hallName}</h2>
      <div className={styles.grid}>
        {grid.map((row, rowIdx) => (
          <div className={styles.row} key={rowIdx}>
            {row.map((seat, colIdx) =>
              seat ? (
                <button
                  key={seat._id}
                  className={[
                    styles.seat,
                    seat.isAvailable ? styles.available : styles.unavailable,
                    selectedSeats.includes(seat._id || "")
                      ? styles.selected
                      : "",
                    styles[seat.type],
                  ].join(" ")}
                  disabled={!seat.isAvailable}
                  onClick={() => onSeatSelect?.(seat)}
                  aria-label={`Seat ${seat.seatNumber}, ${seat.type}, ${
                    seat.isAvailable ? "available" : "unavailable"
                  }, ${seat.price} BGN`}
                  type="button"
                >
                  <span className={styles.seatNumber}>{seat.seatNumber}</span>
                  <span className={styles.seatType}>{seat.type}</span>
                  <span className={styles.seatPrice}>{seat.price} BGN</span>
                </button>
              ) : (
                <span
                  key={`empty-${colIdx}`}
                  className={styles.emptySeat}
                ></span>
              )
            )}
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <span className={`${styles.seat} ${styles.available}`}></span> Available
        <span className={`${styles.seat} ${styles.selected}`}></span> Selected
        <span className={`${styles.seat} ${styles.unavailable}`}></span>{" "}
        Unavailable
        <span className={`${styles.seat} ${styles.vip}`}></span> VIP
        <span className={`${styles.seat} ${styles.couple}`}></span> Couple
      </div>
      <div className={styles.totalPrice}>
        Total Price: <span>{totalPrice} BGN</span>
      </div>
    </div>
  );
};

export default SelectSeatsStep;
