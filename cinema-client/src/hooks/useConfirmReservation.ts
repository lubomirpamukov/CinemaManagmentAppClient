import { useState } from "react";
import { confirmReservationPayment } from "../services";

/**
 * A custom hook that provides functionality to confirm a reservation payment.
 * It manages the loading and error states for the confirmation process.
 *
 * @returns {{
 *  confirmPayment: (reservationId: string) => Promise<boolean>;
 *  loading: boolean;
 *  error: string | null;
 * }} An Object containing the confirmation function and its state.
 */
export const useConfirmReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * An async function that attempts to confirm the payment for a given reservation.
   * @param {string} reservationId - The ID of the reservation to confirm. 
   * @returns {Promise<boolean>} A promise that resolves to "true" on success or "false" on faliure
   */
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
