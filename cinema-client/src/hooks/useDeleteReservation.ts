import { useState } from "react";
import { deleteReservation } from "../services";

export const useDeleteReservation = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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