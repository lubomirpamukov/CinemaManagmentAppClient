import { useState, useEffect } from "react";
import { fetchSessionSeatLayout, type SessionSeatLayout } from "../services";

export const useSessionSeatLayout = (sessionId: string | undefined) => {
  const [layout, setLayout] = useState<SessionSeatLayout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLayout(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetchSessionSeatLayout(sessionId)
      .then(setLayout)
      .catch((err) => setError(err.message || "Failed to fetch seat layout."))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return { layout, loading, error };
};
