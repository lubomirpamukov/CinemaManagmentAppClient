import { useEffect, useState } from "react";
import { fetchCinemasByMovieAndCity } from "../services";
import type { TCinema } from "../validations";

/**
 * A custom hook that fetches available cinemas for a specific movie in a given city.
 *
 * @param {string | null | undefined} movieId - The ID of the movie. The hook will not fetch if this is falsy.
 * @param {string | null | undefined} city - The name of the city. The hook will not fetch if this is falsy.
 * @returns {{
 *   cinemas: TCinema[];
 *   loading: boolean;
 *   error: string | null;
 * }} An object containing the array of cinemas, a loading state, and an error message if one occurred.
 */
export const useMovieCinemas = (
  movieId?: string | null,
  city?: string | null
) => {
  const [cinemas, setCinemas] = useState<TCinema[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId || !city) {
      setCinemas([]);
      return;
    }

    const loadCinemas = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCinemas = await fetchCinemasByMovieAndCity(movieId, city);
        setCinemas(fetchedCinemas);
      } catch (err: any) {
        setError(err.message || "An unknown error occured");
        setCinemas([]);
      } finally {
        setLoading(false);
      }
    };

    loadCinemas();
  }, [movieId, city]);

  return { cinemas, loading, error };
};
