import type { TCinema, TSession } from "../validations";

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

export const fetchBookingSession = async (
  cinemaId?: string,
  hallId?: string,
  movieId?: string,
  date?: string,
  minSeatsRequired?: number
): Promise<TSession[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (movieId) queryParams.append("movieId", movieId);
    if (cinemaId) queryParams.append("cinemaId", cinemaId);
    if (date) queryParams.append("date", date);
    if (typeof minSeatsRequired === "number") queryParams.append("minSeatsRequired", minSeatsRequired.toString());
    if (typeof page === "number") queryParams.append()
  } catch (error) {
    
  }
}
