import { useState, useEffect } from "react";
import { fetchSessionSeatLayout } from "../services";
import { type TSessionSeatLayout } from "../validations";

/**
 * A custom hook that fetches a hall seatlayout for a specific session.
 * @param sessionId The ID of the session, the hook will not fetch if this is falsy.
 * @returns {{
 *  layout: TSessionSeatLayout | null;
 *  loading: boolean;
 *  error: string | null;
 * }} An object containing the session seat layout, a loading state, and an error message if one occurred.
 */
export const useSessionSeatLayout = (sessionId: string | undefined) => {
  const [layout, setLayout] = useState<TSessionSeatLayout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLayout(null);
      return;
    }

    const controller = new AbortController();

    const getSeatsLayout = async () => {
      setLoading(true);
      setError(null);
      try {
        const sessionSeatLayout = await fetchSessionSeatLayout(sessionId, {
          signal: controller.signal,
        });
        setLayout(sessionSeatLayout);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setError(error.message || "A unknown error occurred.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    getSeatsLayout();

    return () => {
      controller.abort();
    };
  }, [sessionId]);

  return { layout, loading, error };
};
