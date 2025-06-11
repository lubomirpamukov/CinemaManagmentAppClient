import { useState, useEffect } from "react";
import { fetchPaginatedResult } from "../services";
import { ZodSchema } from "zod";

export const usePaginated = <T>(
  endpoint: string,
  pageSize: number,
  schema: ZodSchema<T[]>,
  searchQuery?: string
) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchPaginatedResult(
        endpoint,
        currentPage,
        pageSize,
        searchQuery
      );
      const validatedData = schema.parse(response.data);
      setData(validatedData);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setError(null);
    } catch (error: any) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, currentPage, pageSize, searchQuery]);

  const refresh = async () => {
    await fetchData();
  };

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
