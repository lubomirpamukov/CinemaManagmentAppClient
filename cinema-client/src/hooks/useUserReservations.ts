import { useEffect, useState, useCallback } from "react";
import { fetchUserReservations } from "../services";
import type { TReservationDisplay, TReservationFilters } from "../validations";

export const useUserReservations = (filters: TReservationFilters) => {
  const [reservations, setReservations] = useState<TReservationDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(() => {
    if (!filters.userId) {
      setReservations([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetchUserReservations(filters)
      .then((reservationsData) => setReservations(reservationsData))
      .catch((err) => setError(err.message || "Failed to fetch reservation."))
      .finally(() => setLoading(false));
  }, [filters.userId, filters.status]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return { reservations, loading, error, refetch: fetchReservations };
};
