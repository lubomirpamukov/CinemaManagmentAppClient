const BASE_URL = "http://localhost:3123";
/**
 * Fetches data from the specified endpoint with optional query parameters.
 *
 * Constructs a GET request to `${BASE_URL}${baseEndpoint}` and appends any provided
 * query parameters. Handles errors by including endpoint and status information,
 * and appends backend error message if available.
 *
 * @template T - The Expected return type of the response data.
 * @param {string} baseEndpoint - The API endpoint to fetch from.
 * @param {Record<string, string | number | boolean | undefined>} [params] - Optional query parameters to include in the request.
 * @throws {Error} If the request fails, throws an error with details from the backend or a generic message.
 * @returns {Promise<T>} Resolves with the response data parsed as type T.
 */
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
    let errorMsg = `Failed to fetch data from ${baseEndpoint}: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMsg += ` - ${errorData.message}`;
      }
    } catch (error: any) {
      errorMsg = error.message || errorMsg;
    }
    throw new Error(errorMsg);
  }
  const result = await response.json();
  return result as T;
};
