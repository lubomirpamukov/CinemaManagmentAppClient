const BASE_URL = "http://localhost:3123";

export const fetchWithFilters = async <T>(
  baseEndpoint: string, // e.g /session , /movie , etc ..
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> => {
  const queryParams = new URLSearchParams();

  if (params) {
    for (const key in params) {
      const value = params[key];
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    }
  }

  //add ? if there are params
  const queryString = queryParams.toString();
  const url = `${BASE_URL}${baseEndpoint}${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = `Failed to fetch data from ${baseEndpoint}: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage += ` - ${errorData.message}`;
      }
    } catch (e: any) {}
    throw new Error(errorMessage);
  }
  const result = await response.json();
  return result as T;
};
