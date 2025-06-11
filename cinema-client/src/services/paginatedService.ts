const BASE_URL = "http://localhost:3123";

export const fetchPaginatedResult = async (
  endpoint: string,
  currentPage: number,
  pageSize: number,
  searchQuery?: string
) => {
  const response = await fetch(
    `${BASE_URL}${endpoint}?page=${currentPage}&limit=${pageSize}&search=${searchQuery}`,
    {
      credentials: "include",
    }
  );

  if(!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const result = await response.json();
  return result
};

