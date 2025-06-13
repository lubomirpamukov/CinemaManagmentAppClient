import { useEffect, useState } from "react";
import { fetchMovieCities } from "../services";

export const useMovieCities = (movieId?: string | null) => {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    setError(null);
    fetchMovieCities(movieId)
      .then(setCities)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [movieId]);

  return { cities, loading, error };
};
