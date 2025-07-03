import { useState, useEffect } from "react";
import { fetchShowcaseMovies } from "../services";
import { type ShowcaseMovies } from "../validations";

export const useShowcase = () => {
  const [data, setData] = useState<ShowcaseMovies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShowcaseMovies()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
