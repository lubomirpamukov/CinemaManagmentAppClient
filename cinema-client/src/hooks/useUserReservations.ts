import { useEffect, useState, useCallback } from "react";
import { fetchUserReservations } from "../services";
import type { TReservationDisplay } from "../validations";

export const useUserReservations = (userId: string | null) => {
    const [reservations, setReservations] = useState<TReservationDisplay[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

   const fetchReservations = useCallback(() => {
        if (!userId) {
            setReservations([]);
            return;
        }
        setLoading(true);
        setError(null);
        fetchUserReservations(userId)
            .then((reservationsData) => setReservations(reservationsData))
            .catch((err) => setError(err.message || "Failed to fetch reservation."))
            .finally(() => setLoading(false));
    }, [userId]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    return { reservations, loading, error, refetch: fetchReservations };
}