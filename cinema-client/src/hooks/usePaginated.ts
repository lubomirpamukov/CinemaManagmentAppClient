import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchWithFilters } from "../services";
import z, { ZodSchema } from "zod";

export type PaginatedResponse<ItemType> = {
  data: ItemType[];
  totalPages: number;
  currentPage: number;
};

export const usePaginated = <T>(
  endpoint: string,
  pageSize: number,
  itemSchema: ZodSchema<T>,
  otherFilters?: Record<string, string | number | boolean | undefined>,
  resetToken?: any
) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //This combines the item schema with pagination structure.
  const paginatedResponseSchema = useMemo(() => z.object({
    data: z.array(itemSchema),
    totalPages: z.number(),
    currentPage: z.number()
  }), [itemSchema])
  
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [resetToken]);

  const fetchData = useCallback(
    async (pageToFetch: number) => {
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
          paginatedResponseSchema,
          apiParams
        );
        setData(response.data);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        setError("Error fetching data");
        setData([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, pageSize, paginatedResponseSchema, otherFilters]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  const handleSetCurrentPage = useCallback(
    (newPage: number) => {
      if (newPage > 0 && (totalPages === 0 || newPage <= totalPages)) {
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
        }
      }
    },
    [totalPages, currentPage]
  );

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
