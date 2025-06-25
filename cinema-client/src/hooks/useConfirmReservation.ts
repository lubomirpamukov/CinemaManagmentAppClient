import { useState } from "react";
import { confirmReservationPayment } from "../services";

export const useConfirmReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmPayment = async (reservationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await confirmReservationPayment(reservationId);
      return true; // Indicate success
    } catch (err: any) {
      setError(err.message);
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  return { confirmPayment, loading, error };
};