import { z, ZodSchema } from "zod";

const BASE_URL = "http://localhost:3123"; 

/**
 * A generic fetch utility that validates the API response against a Zod schema.
 *
 * @template TSchema The type of the Zod schema provided.
 * @param endpoint The API endpoint to fetch from (e.g., "/movies").
 * @param schema The Zod schema to use for parsing the response.
 * @param params Optional query parameters to send with the request.
 * @returns A promise that resolves to the parsed and validated data. The return type is inferred from the schema.
 * @throws Throws an error if the fetch fails, the response is not ok, or the data fails validation.
 */
export const fetchWithFilters = async <TSchema extends ZodSchema<any>>(
  endpoint: string,
  schema: TSchema,
  params?: Record<string, any>
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