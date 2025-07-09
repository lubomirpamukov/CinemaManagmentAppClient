import { ZodError } from "zod";
import {
  reservationDisplaySchema,
  type TCreateReservation,
  type TReservationDisplay,
  type TReservationFilters,
} from "../validations";
const BASE_URL = "http://localhost:3123/reservation";
/**
 * Make api request to create Reservation
 * @param {TCreateReservation} [reservationData] - Object to create
 * @returns
 */
export const createReservation = async (
  reservationData: TCreateReservation
): Promise<TReservationDisplay> => {
  //to do add return type
  const response = await fetch(BASE_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reservationData),
  });

  if (!response.ok) {
    let errorMsg = `Failed to create reservation from ${BASE_URL} : Status - ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMsg += ` - ${errorData.message}`;
      }
    } catch (error: any) {}
    throw new Error(errorMsg);
  }

  const reservation = await response.json()
  try {
    const validReservation = reservationDisplaySchema.parse(reservation);
    return validReservation
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Failed ReservationDisplaySchema: ${error.errors.map(e => e.message)}`)
    }
  }
  return response.json();
};

export const fetchUserReservations = async (
  filters: TReservationFilters
): Promise<TReservationDisplay[]> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      // If the key is 'status' and it's an array, append each value
      if (key === "status" && Array.isArray(value)) {
        value.forEach((statusValue) => params.append(key, statusValue));
      } else if (typeof value === "string") {
        // Handle other string-based filters like userId
        params.append(key, value);
      }
    }
  });

  const reservations = await fetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!reservations.ok) {
    let errorMsg = "Failed to delete reservation.";
    try {
      const errorData = await reservations.json();
      errorMsg = errorData.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return reservations.json();
};

export const deleteReservation = async (
  reservationId: string
): Promise<void> => {
  const deletedReservation = await fetch(`${BASE_URL}/${reservationId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!deletedReservation.ok) {
    let errorMsg = "Failed to delete reservation.";
    try {
      const errorData = await deletedReservation.json();
      errorMsg = errorData.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
};

export const confirmReservationPayment = async (
  reservationId: string
): Promise<TReservationDisplay> => {
  const response = await fetch(`${BASE_URL}/${reservationId}/confirm`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to confirm reservation.");
  }
  return response.json();
};
