import { useState, useEffect } from "react";
import { fetchMovieById } from "../services";
import { type TMovie } from "../validations";

/**
 * A custom hook that fetches movie details.
 * @param {string} movieId The ID of the movie, if value is falsy the hook will not fetch details.
 * @returns  {{
 *  movie: TMovie | null;
 *  loading: boolean;
 *  error: string | null;
 * }} An object containing movie details, a loading state, and an error message if one occurred.
 */
export const useMovieDetails = (movieId?: string | null) => {
  const [movie, setMovie] = useState<TMovie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setMovie(null);
      return;
    }

    const controller = new AbortController();

    const loadMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const movie = await fetchMovieById(movieId, {
          signal: controller.signal,
        });
        setMovie(movie);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setError(error.message || "An unknown error occurred.");
          setMovie(null);
        }
      } finally {
          if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadMovieDetails();

    return () => {
      controller.abort();
    };
  }, [movieId]);

  return { movie, loading, error };
};
