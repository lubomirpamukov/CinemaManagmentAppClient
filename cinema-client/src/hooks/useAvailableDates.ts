import { useEffect, useState } from "react";
import { fetchAvailableDates } from "../services";

/**
 * A custom hook to fetch available projection dates for a given movie and cinema.
 *
 * @param {string | undefined | null} movieId - The ID of the movie. The hook will not fetch if this is falsy.
 * @param {string | undefined | null} cinemaId - The ID of the cinema. The hook will not fetch if this is falsy.
 * @returns {{
 *   availableDates: string[];
 *   loading: boolean;
 *   error: string | null;
 * }} An object containing the array of available dates, a loading state, and an error message if one occurred.
 */

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
