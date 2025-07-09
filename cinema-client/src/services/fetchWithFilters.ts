import { ZodError, type ZodSchema } from "zod";

const BASE_URL = "http://localhost:3123";
/**
 * Fetches and validates data from the specified endpoint with optional query parameters.
 *
 * @template T - The expected return type of the response data, inferred from the schema.
 * @param {string} baseEndpoint - The API endpoint to fetch from (e.g., "/session").
 * @param {ZodSchema<T>} schema - The Zod schema to validate the response data.
 * @param {Record<string, string | number | boolean | undefined>} [params] - Optional query parameters.
 * @throws {Error} If the request fails or if the response data fails schema validation.
 * @returns {Promise<T>} Resolves with the validated response data.
 */
export const fetchWithFilters = async <T>(
  baseEndpoint: string, // e.g /session , /movie , etc ..,
  schema: ZodSchema<T>,
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
    } catch (error: any) {}
    throw new Error(errorMsg);
  }
  const result = await response.json();

  //Validate successful response against schema
  try {
    return schema.parse(result);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`API response validation failed - ${error.errors.map((e) => e.message).join(", ")}`)
    }
    throw error;
  }
};
