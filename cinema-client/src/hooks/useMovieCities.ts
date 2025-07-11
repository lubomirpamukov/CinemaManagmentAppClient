import { useEffect, useState } from "react";
import { fetchMovieCities } from "../services";

/**
 * A custom hook that fetches all cities where a specific movie is being projected.
 *
 * @param {string | null | undefined} movieId - The ID of the movie. The hook will not fetch if this is falsy.
 * @returns {{
 *   cities: string[];
 *   loading: boolean;
 *   error: string | null;
 * }} An object containing an array of city names, a loading state, and an error message if one occurred.
 */
export const useMovieCities = (movieId?: string | null) => {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setCities([]);
      return;
    }

    const controller = new AbortController();

    const loadCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCities = await fetchMovieCities(movieId, {
          signal: controller.signal,
        });
        setCities(fetchedCities);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setError(error.message || "An unknown error occurred.");
          setCities([]);
        }
      } finally {
          if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCities();

    return () => {
      controller.abort();
    }
  }, [movieId]);

  return { cities, loading, error };
};
