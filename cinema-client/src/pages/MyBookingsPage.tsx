import React, { useEffect, useState } from "react";
import { useUserReservations, useDeleteReservation } from "../hooks";
import { useAuth } from "../hooks";
import styles from "./MyBookings.module.css";
import Spinner from "../components/Spinner";
import type { TReservationDisplay, TReservationFilters } from "../validations";
import ReservationCard from "../components/reservation/ReservationCard";
import { FaTrash } from "react-icons/fa";

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<TReservationFilters>({});
  const { reservations, loading, error, refetch } =
    useUserReservations(filters);
  const { deleteReservation } = useDeleteReservation();

  useEffect(() => {
    if (user?.id) setFilters((prev) => ({ ...prev, userId: user.id }));
  }, [user?.id]);

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
          <ReservationCard
            key={booking._id}
            reservation={booking}
            actions={
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(booking._id)}
                type="button"
              >
                <FaTrash />
                Delete
              </button>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;
