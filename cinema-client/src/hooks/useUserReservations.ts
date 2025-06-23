import { useEffect, useState } from "react";
import { fetchUserReservations } from "../services";
import type { TReservationDisplay } from "../validations";

export const useUserReservations = (userId: string | null) => {
    const [reservations, setReservations] = useState<TReservationDisplay[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setReservations([]);
            return;
        }

        setLoading(false);
        setError(null);
        fetchUserReservations(userId)
        .then((reservationsData) => setReservations(reservationsData))
        .catch((err) => setError(err.message || "Failed to fetch reservation."))
        .finally(() => setLoading(false))
    }, [userId]);

    return { reservations, loading, error};
}