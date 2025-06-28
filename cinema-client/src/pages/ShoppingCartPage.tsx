import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useUserReservations, useConfirmReservation } from "../hooks";
import Spinner from "../components/Spinner";
import styles from "./ShoppingCartPage.module.css";
import ReservationCard from "../components/reservation/ReservationCard";

const ShoppingCartPage: React.FC = () => {
  const { user } = useAuth();

  const filters = useMemo(() => ({
    userId: user?.id,
    status: ["pending"] as ("pending" | "confirmed" | "failed" | "completed")[]
  }), [user?.id]);

  const {
    reservations: pendingReservations,
    loading,
    error,
    refetch,
  } = useUserReservations(filters);

  const {
    confirmPayment,
    loading: isConfirming,
    error: confirmError,
  } = useConfirmReservation();

  const handleConfirm = async (reservationId: string) => {
    const success = await confirmPayment(reservationId);
    if (success) refetch();
  };

  if (loading) return <Spinner size="medium" />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Shopping Cart</h1>
      {confirmError && <div className={styles.error}>{confirmError}</div>}

      {pendingReservations.length === 0 ? (
        <p className={styles.emptyMessage}>Your cart is empty.</p>
      ) : (
        <div className={styles.list}>
          {pendingReservations.map((res) => (
            <ReservationCard
            key={res._id}
            reservation={res}
            actions={
              <button 
                className={styles.confirmButton}
                onClick={() => handleConfirm(res._id)}
                disabled={isConfirming}
              >
                {isConfirming ? "Processing..." : "Confirm & Pay"}
              </button>
            }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;
