import { useEffect, useState } from "react";
import { fetchCinemasByMovieAndCity } from "../services";
import type { TCinema } from "../validations";

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
        setCinemas(fetchedCinemas)
      } catch (err: any) {
        setError(err.message || "An unknown error occured");
        setCinemas([]);
      } finally {
        setLoading(false);
      }
    };

    loadCinemas();
  }, [movieId, city]);

  return { cinemas, loading, error}
};
