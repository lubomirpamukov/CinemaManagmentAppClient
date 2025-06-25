import React, { useEffect, useState } from "react";
import { useUserReservations, useDeleteReservation } from "../hooks";
import { useAuth } from "../context/AuthContext";
import styles from "./MyBookings.module.css";
import Spinner from "../components/Spinner";
import type { TReservationDisplay } from "../validations";
import type { TReservationFilters } from "../services/";

const MyBookingsPage: React.FC = () => {
  const { userId } = useAuth();
  const [filters, setFilters] = useState<TReservationFilters>({});
  const { reservations, loading, error, refetch } =
    useUserReservations(filters);
  const { deleteReservation } = useDeleteReservation();

  useEffect(() => {
    if (userId) setFilters((prev) => ({ ...prev, userId }));
  }, [userId]);

  const handleStatusClick = (
    status: "pending" | "confirmed" | "failed" | "completed"
  ) => {
    setFilters((prev) => {
      const currentStatuses = prev.status || [];
      // If the status is already selected, remove it. Otherwise, add it.
      const newStatuses = currentStatuses.includes(status)
        ? currentStatuses.filter((s) => s !== status)
        : [...currentStatuses, status];

      return {
        ...prev,
        status: newStatuses.length > 0 ? newStatuses : undefined,
      };
    });
  };

  const reservationStatuses: Array<
    "pending" | "confirmed" | "failed" | "completed"
  > = ["pending", "confirmed", "failed", "completed"];

  const handleDelete = async (reservationId: string) => {
    if (window.confirm("Are you sure you want to delete thi reservation?")) {
      try {
        await deleteReservation(reservationId, refetch);
      } catch (error) {}
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Bookings</h2>

      <div className={styles.filterContainer}>
        <div className={styles.filterButtons}>
          {reservationStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className={`${styles.filterButton} ${
                filters.status?.includes(status) ? styles.active : ""
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && <Spinner />}
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.list}>
        {reservations.map((booking: TReservationDisplay) => (
          <div className={styles.card} key={booking._id}>
            <div className={styles.header}>
              <span className={styles.movie}>{booking.movieName}</span>
              <span className={styles.status} data-status={booking.status}>
                {booking.status}
              </span>
            </div>
            <div className={styles.details}>
              <div>
                <strong>Reservation Code:</strong> {booking.reservationCode}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(
                  `${booking.sessionDate}T${booking.sessionStartTime}`
                ).toLocaleString()}
              </div>
              <div>
                <strong>Hall:</strong> {booking.hallName}
              </div>
              <div>
                <strong>Seats:</strong>{" "}
                {booking.seats.map((seat) => seat.seatNumber).join(", ")}
              </div>
              {booking.purchasedSnacks.length > 0 && (
                <div>
                  <strong>Snacks:</strong>{" "}
                  {booking.purchasedSnacks
                    .map((snack) => `${snack.name} x${snack.quantity}`)
                    .join(", ")}
                </div>
              )}
              <div className={styles.price}>
                <strong>Total:</strong> {booking.totalPrice.toFixed(2)} BGN
              </div>
            </div>
            <div className={styles.meta}>
              <span>
                <strong>Created:</strong>{" "}
                {new Date(booking.createdAt).toLocaleDateString()}
              </span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(booking._id)}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;
