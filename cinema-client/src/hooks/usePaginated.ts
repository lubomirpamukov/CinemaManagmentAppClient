import { useState, useEffect, useCallback } from "react";
import { fetchWithFilters } from "../services";
import { ZodSchema } from "zod";

export type PaginatedResponse<ItemType> = {
  data: ItemType[];
  totalPages: number;
  currentPage: number;
}

export const usePaginated = <T>(
  endpoint: string,
  pageSize: number,
  schema: ZodSchema<T[]>,
  otherFilters?: Record<string, string | number | boolean | undefined>
) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (pageToFetch: number) => {
    setLoading(true);
    setError(null);

    const apiParams: Record<string, string | number | boolean | undefined> = {
      ...otherFilters, 
      page: pageToFetch,
      limit: pageSize,
    };

    try {
      const response = await fetchWithFilters<PaginatedResponse<T>>(
        endpoint,
        apiParams
      );
      const validatedData = schema.parse(response.data);
      setData(validatedData);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error: any) {
      setError("Error fetching data");
      setData([])
      setTotalPages(0)
    } finally {
      setLoading(false);
    }
  }, [endpoint, pageSize, schema, otherFilters]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [otherFilters, endpoint, pageSize, schema])

  const handleSetCurrentPage = useCallback((newPage: number) => {
    if (newPage > 0 && (totalPages === 0 || newPage <= totalPages)) {
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    }
  },[totalPages, currentPage])

  const refresh = useCallback(async () => {
    await fetchData(currentPage);
  }, [fetchData, currentPage]);

  return {
    data,
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage: handleSetCurrentPage,
    refresh,
  };
};
