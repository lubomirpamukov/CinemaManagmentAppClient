import { ZodError } from "zod";
import {
  type TMovie,
  movieSchema,
  mongooseObjectIdValidationRegex,
  type ShowcaseMovies,
  showcaseMoviesSchema,
} from "../validations";

const BASE_URL = "http://localhost:3123/movies";
/**
 * Fetches movie object from endpoint "/movies/:id".
 *
 * Validates movieId before making backend call.
 *
 * @param {string} movieId - The ID of the movie.
 * @throws {Error} Throws if the movieId is invalid,
 * if the backend returns an error (with server message and status if available),
 * or if the response data fails schema validation.
 * @returns {Promise<TMovie>} Resolves to validated movie object.
 */
export const fetchMovieById = async (movieId: string): Promise<TMovie> => {
  if (!mongooseObjectIdValidationRegex.parse(movieId))
    throw new Error("Invalid Movie ID format.");

  const validateMovieId = mongooseObjectIdValidationRegex.parse(movieId);
  if (!validateMovieId) throw new Error("Invalid Movie ID format.");

  const movieResponse = await fetch(`${BASE_URL}/${movieId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!movieResponse.ok) {
    let errMsg = `Failed to return movie from ${BASE_URL}/${movieId} : ${movieResponse.status}`;
    try {
      const errorData = await movieResponse.json();
      if (errorData && errorData.message) {
        errMsg += ` - ${errorData.message}`;
      }
    } catch (error: any) {}
    throw new Error(errMsg);
  }
  const movieData = await movieResponse.json();
  try {
    const validatedMovie = movieSchema.parse(movieData);
    return validatedMovie;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Movie data validation failed: ${error.errors.map((e) => e.message)}`
      );
    }
    throw error;
  }
};

/**
 *  Fetches a ShowcaseMovie object from endpoint "/movies/showcase"
 * @throws {Error} If the backend returns an error (throws server message and status if avaliable),
 * or if the response data fails schema validation (throws zod validation errors.)
 * @returns {Promise<ShowcaseMovies>} Resolves to the validated showcase movies object.
 */
export const fetchShowcaseMovies = async (): Promise<ShowcaseMovies> => {
  const response = await fetch(`${BASE_URL}/showcase`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    let errorMsg = `Failed to fetch Showcase Movies from : ${BASE_URL}/showcase : ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMsg += ` - ${errorData.message}`;
      }
    } catch (error: any) {}
    throw new Error(errorMsg);
  }

  const moviesShowcase = await response.json();
  try {
    const validatedMoviesShowcase = showcaseMoviesSchema.parse(moviesShowcase);
    return validatedMoviesShowcase;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Showcase Movie data validation failed: ${error.errors.map(
          (e) => e.message
        )}`
      );
    }
    throw error;
  }
};
