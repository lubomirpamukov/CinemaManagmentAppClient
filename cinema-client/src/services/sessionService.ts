import z, { ZodError } from "zod";
import type { PaginatedResponse } from "../hooks";
import {
  cinemaSchema,
  mongooseObjectIdValidationRegex,
  createPaginatedResponseSchema,
  sessionDisplaySchema,
  sessionSeatLayoutSchema,
  type TCinema,
  type TSessionDisplay,
  type TSessionSeatLayout
} from "../validations";
import { fetchWithFilters } from "./fetchWithFilters";

const BASE_URL = "http://localhost:3123";

/**
 * Fetches cinemas that have projections for a specific movie in a given city.
 *
 * @param {string} movieId - The ID of the movie.
 * @param {string} city - The name of the city.
 * @throws {Error} Throws an error if the request fails (including server status and message if available)
 * or if the response data fails schema validation.
 * @returns {Promise<TCinema[]>} Resolves to an array of validated cinema objects.
 */
export const fetchCinemasByMovieAndCity = async (
  movieId: string,
  city: string
): Promise<TCinema[]> => {
    if (!mongooseObjectIdValidationRegex.parse(movieId))
    throw new Error("Invalid Movie ID format.");

  const response = await fetch(
    `${BASE_URL}/cinemas/by-city-and-movie?movieId=${movieId}&city=${encodeURIComponent(
      city
    )}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    let errMsg = `Failed to fetch cinemas by movie and city. ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errMsg += ` - ${errorData.message}`;
      }
    } catch (error: any) {}
    throw new Error(errMsg);
  }

  const cinemas = await response.json();
  try {
    return z.array(cinemaSchema).parse(cinemas);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Failed to pass zod validation schema: ${error.errors.map(
          (e) => e.message
        )}`
      );
    }
    throw error;
  }
};

/**
 * Fetches available projection dates for a specific movie and cinema.
 *
 * @param {string} movieId - The ID of the movie.
 * @param {string} cinemaId - The ID of the cinema.
 * @throws {Error} Throws an error if the request fails (including server status and message if available)
 * or if the response data contains invalid date strings.
 * @returns {Promise<string[]>} Resolves to an array of validated and available date strings.
 */
export const fetchAvailableDates = async (
  movieId: string,
  cinemaId: string
): Promise<string[]> => {
  if (!mongooseObjectIdValidationRegex.parse(movieId))
    throw new Error("Invalid Movie ID format.");

  if (!mongooseObjectIdValidationRegex.parse(cinemaId))
    throw new Error("Invalid Cinema ID format.");

  const response = await fetch(
    `${BASE_URL}/session/available-dates?movieId=${movieId}&cinemaId=${cinemaId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    let errMsg = `Failed to fetch avaliable dates. Status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errMsg += ` - ${errorData.message}`;
      }
    } catch (error) {}
    throw new Error(errMsg);
  }

  const dates = await response.json();

  //Defina a schema to validate an array of date-like strings.
  const dateArraySchema = z.array(
    z.string().refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Invalid date string format received from API",
    })
  );

  try {
    return dateArraySchema.parse(dates);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Date validation failed: ${error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }
    throw error;
  }
};

export type FetchBookingsSessionParams = {
  cinemaId?: string;
  hallId?: string;
  movieId?: string;
  date?: string;
  minSeatsRequired?: number;
  page?: number;
  limit?: number;
};

/**
 * Fetches a paginated list of booking sessions based on filter criteria.
 *
 * @param {FetchBookingsSessionParams} params - The filter and pagination parameters.
 * @throws {Error} Throws an error if the fetch request fails or if the response data fails schema validation.
 * @returns {Promise<PaginatedResponse<TSessionDisplay>>} A promise that resolves to the validated paginated session data.
 */
export const fetchBookingSessions = async (
  params: FetchBookingsSessionParams
): Promise<PaginatedResponse<TSessionDisplay>> => {
  const endpoint = "/session";

  // 1. Create the specific schema for a paginated response of sessions.
  const paginatedSessionSchema =
    createPaginatedResponseSchema(sessionDisplaySchema);

  return fetchWithFilters(endpoint, paginatedSessionSchema, params);
};


/**
 * Fetches the complete seat layout for a specific session.
 *
 * @param {string} sessionId - The ID of the session.
 * @throws {Error} Throws an error if the session ID is invalid, the request fails, or the response data is malformed.
 * @returns {Promise<TSessionSeatLayout>} A promise that resolves to the validated session seat layout data.
 */
export const fetchSessionSeatLayout = async (
  sessionId: string
): Promise<TSessionSeatLayout> => {
  if (!mongooseObjectIdValidationRegex.parse(sessionId)) {
    throw new Error("Invalid Session ID format.")
  }

  const endpoint = `/session/${sessionId}/seat-layout`;
  return await fetchWithFilters(endpoint, sessionSeatLayoutSchema);
};
