import { useState } from "react";
import { deleteReservation } from "../services";

/**
 * A custom hook that provides functionality to delete a reservation.
 * It manages the loading and error states for the deletion process.
 * 
 * @returns {{
 *  deleteReservation (reservationId: string, onSuccess?() => void) => Promise<void>;
 *  loading: boolean;
 *  error: string | null;
 * }} An object containing a deletion function and its state.
 */
export const useDeleteReservation = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * An async function that attempts to delete a reservation.
     * @param {string} reservationId The ID of the reservation to delete. 
     * @param {() => void} [onSuccess] An optional callback function to execute upon successful deletion.
     */
    const handleDelete = async (reservationId: string, onSuccess?: () => void) => {
        setLoading(true);
        setError(null);
        try {
            await deleteReservation(reservationId);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { deleteReservation: handleDelete, loading, error };
}