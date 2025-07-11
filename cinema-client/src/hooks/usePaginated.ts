import { useState, useEffect, useCallback } from "react";
import { fetchWithFilters } from "../services";
import { z, ZodSchema } from "zod";
import { createPaginatedResponseSchema } from "../validations/paginated"; // Assuming this is the path

export type PaginatedResponse<T> = z.infer<
  ReturnType<typeof createPaginatedResponseSchema<ZodSchema<T>>>
>;

/**
 * A generic hook for fetching, managing, and paginating data from an API endpoint.
 * It handles loading and error states, page changes, and manual refreshes.
 *
 * @template T The type of the individual items in the paginated list.
 *
 * @param {string} endpoint The base API endpoint to fetch data from (e.g., "/movies").
 * @param {number} pageSize The number of items to fetch per page.
 * @param {ZodSchema<T>} itemSchema The Zod schema for validating a single item from the API response.
 * @param {Record<string, any>} [otherFilters] An object of additional filters to apply to the query.
 *   IMPORTANT: For performance, this object should be memoized with `useMemo` in the calling component
 *   to prevent unnecessary API refetches on every render.
 * @param {any} [resetToken] A dependency that, when its value changes, will reset the pagination to the first page.
 *   Useful for when filters change and you want to start from page 1.
 *
 * @returns {{
 *   data: T[];
 *   currentPage: number;
 *   totalPages: number;
 *   loading: boolean;
 *   error: string | null;
 *   setCurrentPage: (page: number) => void;
 *   refresh: () => void;
 * }} An object containing the paginated data and state management tools.
 *
 * @example
 * // In a component that displays a list of movies
 * import { usePaginated } from './usePaginated';
 * import { movieSchema } from '../validations';
 * import { useMemo, useState } from 'react';
 *
 * const MovieList = () => {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const filters = useMemo(() => ({ title: searchTerm }), [searchTerm]);
 *
 *   const {
 *     data: movies,
 *     currentPage,
 *     totalPages,
 *     loading,
 *     error,
 *     setCurrentPage,
 *     refresh
 *   } = usePaginated('/movies', 10, movieSchema, filters, searchTerm);
 *
 *   if (loading) return <p>Loading movies...</p>;
 *   if (error) return <p>Error: {error}</p>;
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={searchTerm}
 *         onChange={(e) => setSearchTerm(e.target.value)}
 *         placeholder="Search for a movie..."
 *       />
 *       <button onClick={refresh}>Refresh</button>
 *       <ul>
 *         {movies.map(movie => <li key={movie.id}>{movie.title}</li>)}
 *       </ul>
 *       <div>
 *         <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage <= 1}>
 *           Previous
 *         </button>
 *         <span>Page {currentPage} of {totalPages}</span>
 *         <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}>
 *           Next
 *         </button>
 *       </div>
 *     </div>
 *   );
 * }
 */
export const usePaginated = <T>(
  endpoint: string,
  pageSize: number,
  itemSchema: ZodSchema<T>,
  otherFilters?: Record<string, any>,
  resetToken?: any
) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to reset to page 1 when filters change
  useEffect(() => {
    // This check prevents resetting to page 1 when the component first mounts
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [otherFilters, resetToken]);

  // Primary data fetching effect
  useEffect(() => {
    const paginatedSchema = createPaginatedResponseSchema(itemSchema);

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const apiParams = { ...otherFilters, page: currentPage, limit: pageSize };

      try {
        // Let fetchWithFilters infer the return type from the schema
        const response = await fetchWithFilters(
          endpoint,
          paginatedSchema,
          apiParams
        );
        setData(response.data);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data.");
        setData([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, endpoint, pageSize, itemSchema, otherFilters]);

  const refresh = useCallback(() => {
    // Manually trigger a fetch of the current page
    // This is useful for pull-to-refresh or manual refresh buttons
    const paginatedSchema = createPaginatedResponseSchema(itemSchema);
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const apiParams = { ...otherFilters, page: currentPage, limit: pageSize };
      try {
        const response = await fetchWithFilters(
          endpoint,
          paginatedSchema,
          apiParams
        );
        setData(response.data);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, endpoint, pageSize, itemSchema, otherFilters]);

  return {
    data,
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage,
    refresh,
  };
};