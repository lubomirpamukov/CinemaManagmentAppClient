import type { PaginatedResponse } from "../hooks";
import {
  mongooseObjectIdValidationRegex,
  seatsSchema,
  type TCinema,
  type THallSeat,
  type TSessionDisplay,
} from "../validations";
import { fetchWithFilters } from "./fetchWithFilters";

const BASE_URL = "http://localhost:3123";

export const fetchCinemasByMovieAndCity = async (
  movieId: string,
  city: string
): Promise<TCinema[]> => {
  try {
    const sessions = await fetch(
      `${BASE_URL}/cinemas/by-city-and-movie?movieId=${movieId}&city=${encodeURIComponent(
        city
      )}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return sessions.json();
  } catch (error) {
    throw new Error("Error occured while fetching sessions.");
  }
};

export const fetchAvailableDates = async (
  movieId: string,
  cinemaId: string
): Promise<string[]> => {
  try {
    const availableDates = await fetch(
      `${BASE_URL}/session/available-dates?movieId=${movieId}&cinemaId=${cinemaId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return availableDates.json();
  } catch (error) {
    throw new Error("Error occured while fetching available dates.");
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

export const fetchBookingSessions = async (
  params: FetchBookingsSessionParams
): Promise<PaginatedResponse<TSessionDisplay>> => {
  const endpoint = "/session";

  const finalParams: Record<string, string | number | boolean | undefined> = {
    movieId: params.movieId,
    cinemaId: params.cinemaId,
    hallId: params.hallId,
    date: params.date,
    minSeatsRequired: params.minSeatsRequired,
    page: params.page || 1,
    limit: params.limit || 10,
  };

  try {
    const response = await fetchWithFilters<PaginatedResponse<TSessionDisplay>>(
      endpoint,
      finalParams
    );
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch booking sessions: ${error.message}`);
    }
    throw new Error(
      "An unknown error occurred while fetching booking sessions."
    );
  }
};

export type SessionSeatLayout = {
  sessionId: string;
  hallId: string;
  hallName: string;
  hallLayout: {
    rows: number;
    columns: number;
  };
  seats: THallSeat[];
};

export const fetchSessionSeatLayout = async (
  sessionId: string
): Promise<SessionSeatLayout> => {
  if (!mongooseObjectIdValidationRegex.parse(sessionId))
    throw new Error("Invalid Session ID format.");

  const sessionSeatLayout = await fetch(
    `${BASE_URL}/session/${sessionId}/seat-layout`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!sessionSeatLayout.ok)
    throw new Error(`Failed to fetch seat layout: ${sessionSeatLayout.status}`);
  const data: SessionSeatLayout = await sessionSeatLayout.json();

  seatsSchema.array().parse(data.seats);
  return data;
};
