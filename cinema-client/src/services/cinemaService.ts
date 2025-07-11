import { mongooseObjectIdValidationRegex } from "../validations";

const BASE_URL = "http://localhost:3123/cinemas";

/**
 * Fetches all cities where the specified movie is projected.
 *
 * Makes a GET request to the endpoint `/cinemas/movies/:movieId`.
 *
 * @param {string} movieId - The ID of the movie.
 * @param {object} [options] - Optional fetch options.
 * @param {AbortSignal} [options.signal] - An AbortSignal that can be used to cancel the request.
 * @throws {Error} If the request fails, throws an error with details from the backend or a generic message.
 * @returns {Promise<string[]>} Resolves to an array of city names where the movie is shown.
 */
export const fetchMovieCities = async (
  movieId: string,
  options?: { signal: AbortSignal }
): Promise<string[]> => {
  if (!mongooseObjectIdValidationRegex.parse(movieId))
    throw new Error("Invalid Movie ID format.");

  const cities = await fetch(`${BASE_URL}/movies/${movieId}`, {
    method: "GET",
    credentials: "include",
    signal: options?.signal,
  });

  if (!cities.ok) {
    let errorMsg = `Failed to fetch cities from ${BASE_URL}/movies/${movieId}: ${cities.status}`;
    try {
      const errorData = await cities.json();
      if (errorData && errorData.message) {
        errorMsg += ` - ${errorData.message}`;
      }
    } catch (error: any) {
      errorMsg = error.message || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return cities.json();
};
