import { useEffect, useState, useCallback } from "react";
import { fetchUserReservations } from "../services";
import type { TReservationDisplay, TReservationFilters } from "../validations";

/**
 * A hook that fetches user reservations based on reservation status and provides manual refresh functionality.
 * @param {TReservationFilters} filters The reservation filters (e.g., `userId` and `status`).
 * @returns {{
 *  reservations: TReservationDisplay[];
 *  loading: boolean;
 *  error: string | null;
 *  refetch: () => Promise<void>;
 * }} An object containing the reservations, loading/error states, and a refetch function.
 */
export const useUserReservations = (filters: TReservationFilters) => {
  const [reservations, setReservations] = useState<TReservationDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(
    async (signal?: AbortSignal) => {
      if (!filters.userId) {
        setReservations([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const reservationsData = await fetchUserReservations(filters, {
          signal,
        });
        setReservations(reservationsData);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unknown error occurred.");
          setReservations([]);
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [filters.userId, filters.status]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchReservations(controller.signal);

    return () => {
      controller.abort();
    }
  }, [fetchReservations]);

  return { reservations, loading, error, refetch: fetchReservations };
};
