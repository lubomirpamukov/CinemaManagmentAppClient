import { useState, useEffect } from "react";
import { fetchBookingSessions } from "../services/sessionService";
import type { TSessionDisplay } from "../validations";
import type { PaginatedResponse } from "./usePaginated";
import type { FetchBookingsSessionParams } from "../services";

/**
 * Fetches a paginated list of movie sessions based on a set of filter criteria.
 * 
 * @param {FetchBookingsSessionParams} filters - An object containing the filter criteria.
 *   Note: For performance, this object should be memoized (e.g., with `useMemo`) in the calling component.
 * @returns {{
 *   sessions: TSessionDisplay[];
 *   loading: boolean;
 *   error: string | null;
 *   totalPages: number;
 *   currentPage: number;
 * }} An object containing the session data and the current request state.
 */
export const useFilteredSessions = (filters: FetchBookingsSessionParams) => {
  const [sessions, setSessions] = useState<TSessionDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  // determine if any filters exist
  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(
      (value) => value !== undefined
    );

    if (!hasActiveFilters) {
      setSessions([]);
      setTotalPages(0);
      setCurrentPage(0);
      setLoading(false);
      setError(null);
      return;
    }

    const loadSessions = async () => {
      setLoading(true);
      setError(null);

      try {
        const sessions: PaginatedResponse<TSessionDisplay> =
          await fetchBookingSessions(filters);
        setSessions(sessions.data);
        setTotalPages(sessions.totalPages);
        setCurrentPage(sessions.currentPage);
      } catch (error: any) {
        setError(error.message || "Failed to fetch sessions");
        setSessions([]);
        setTotalPages(0);
        setCurrentPage(0);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [filters]);

  return { sessions, loading, error, totalPages, currentPage };
};
