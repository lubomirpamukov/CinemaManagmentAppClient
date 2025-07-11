import { z, ZodSchema } from "zod";

const BASE_URL = "http://localhost:3123"; 

/**
 * A generic fetch utility that validates the API response against a Zod schema.
 *
 * @template TSchema The type of the Zod schema provided.
 * @param {string} endpoint The API endpoint to fetch from (e.g., "/movies").
 * @param {TSchema} schema The Zod schema to use for parsing the response.
 * @param {object} [options] Optional fetch options
 * @param {AbortSignal} [options.signal] An AbortSignal that can cancel a request.
 * @param {Record<string, any>}params Optional query parameters to send with the request.
 * @throws {Error} Throws an error if the fetch fails, the response is not ok, or the data fails validation.
 * @returns {Promise<TSchema>} A promise that resolves to the parsed and validated data. The return type is inferred from the schema.
 */
export const fetchWithFilters = async <TSchema extends ZodSchema<any>>(
  endpoint: string,
  schema: TSchema,
  params?: Record<string, any>,
  options?: { signal?: AbortSignal }
): Promise<z.infer<TSchema>> => {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
  }

  const response = await fetch(`${BASE_URL}${endpoint}?${query.toString()}`, {
    method: "GET",
    credentials: "include",
    signal: options?.signal,
  });

  if (!response.ok) {
    let errMsg = `API Error at ${endpoint}: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errMsg += ` - ${errorData.message}`;
      }
    } catch (error) {
    }
    throw new Error(errMsg);
  }

  const data = await response.json();

  const validationResult = schema.safeParse(data);

  if (!validationResult.success) {
    throw new Error(
      `API response validation failed: ${validationResult.error.errors
        .map((e) => e.message)
        .join(", ")}`
    );
  }

  return validationResult.data;
};