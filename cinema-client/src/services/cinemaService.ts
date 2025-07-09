const BASE_URL = "http://localhost:3123/cinemas";

/**
 * Fetches all cities where the specified movie is projected.
 *
 * Makes a GET request to the endpoint `/cinemas/movies/:movieId`.
 *
 * @param {string} movieId - The ID of the movie.
 * @throws {Error} If response fails thorws an error with the details from the backend or a generic message.
 * @returns {Promise<string[]>} Resolves to an array of city names where the movie is shown.
 */
export const fetchMovieCities = async (movieId: string): Promise<string[]> => {
  const cities = await fetch(`${BASE_URL}/movies/${movieId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!cities.ok) {
    let errorMsg = `Failed to fetch cities from /cinemas/movies/${movieId}: ${cities.status}`;
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
