import { useState, useEffect } from "react";
import { fetchShowcaseMovies } from "../services";
import { type ShowcaseMovies } from "../validations";

/**
 * Fetches the showcase movies (e.g., new, recommended, popular) for display on the main page.
 * This hook handles the complete data fetching lifecycle, including loading and error states.
 *
 * @returns {{
 *  data: ShowcaseMovies | null;
 *  loading: boolean;
 *  error: string | null;
 * }} An object containing the showcase movie categories, a loading state, and an error message if one occurred.
 *
 */
export const useShowcase = () => {
  const [data, setData] = useState<ShowcaseMovies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // AbortController helps prevent state updates on unmounted components
    const controller = new AbortController();

    const getShowcaseData = async () => {
      try {
        setLoading(true);
        setError(null);
        const showcaseData = await fetchShowcaseMovies({signal: controller.signal});
        setData(showcaseData);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    getShowcaseData();

    // Cleanup function: aborts the fetch if the component unmounts
    return () => {
      controller.abort();
    };
  }, []);

  return { data, loading, error };
};