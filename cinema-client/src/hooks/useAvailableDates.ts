import { useEffect, useState } from "react";
import { fetchAvailableDates } from "../services";

export const useAvailableDates = (
  movieId?: string | null,
  cinemaId?: string | null
) => {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId || !cinemaId) {
      setAvailableDates([]);
      return;
    }

    const loadDates = async () => {
      setLoading(true);
      setError(null);

      try {
        const dates = await fetchAvailableDates(movieId, cinemaId);
        setAvailableDates(dates);
      } catch (error: any) {
        setError(
          error.message || "An unknown error occured while fetching dates."
        );
        setAvailableDates([]);
      } finally {
        setLoading(false);
      }
    };

    loadDates();
  }, [movieId, cinemaId]);

  return { availableDates, loading, error };
};
