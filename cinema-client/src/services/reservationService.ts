import z, { ZodError } from "zod";
import {
  mongooseObjectIdValidationRegex,
  reservationDisplaySchema,
  type TCreateReservation,
  type TReservationDisplay,
  type TReservationFilters,
} from "../validations";
const BASE_URL = "http://localhost:3123/reservation";

/**
 * Makes an API request to create a reservation.
 *
 * @param {TCreateReservation} reservationData - The reservation data to create.
 * @throws {Error} If the backend returns an error (with server message and status if available),
 * or if the response data fails schema validation.
 * @returns {Promise<TReservationDisplay>} Resolves to the validated reservation object.
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

  const reservation = await response.json();
  try {
    const validReservation = reservationDisplaySchema.parse(reservation);
    return validReservation;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Failed ReservationDisplaySchema: ${error.errors.map((e) => e.message)}`
      );
    }
  }
  return response.json();
};

/**
 * Fetches reservations for a user, with optional filters.
 * @param {TReservationFilters} [filters] - Optional filters, such as userId and status array.
 * @param {object} [options] Optional fetch options
 * @param {AbortSignal} [options.signal] An AbortSignal to cancel request if needed.
 * @throws {Error} If the backend returns an error (with server message and status if available),
 * or if the response data fails schema validation.
 * @returns {Promise<TReservationDisplay[]>} Resolves to an array of validated reservation objects.
 */
export const fetchUserReservations = async (
  filters?: TReservationFilters,
  options?: { signal?: AbortSignal }
): Promise<TReservationDisplay[]> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === "status" && Array.isArray(value)) {
          value.forEach((statusValue) => params.append(key, statusValue));
        } else if (typeof value === "string") {
          params.append(key, value);
        }
      }
    });
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    signal: options?.signal,
  });

  if (!response.ok) {
    let errorMsg = `Failed to fetch reservations from ${BASE_URL}?${params.toString()}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMsg += ` - ${errorData.message}`;
      }
    } catch {}
    throw new Error(errorMsg);
  }

  const reservationsData = await response.json();
  try {
    return z.array(reservationDisplaySchema).parse(reservationsData);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Reservation list validation failed: ${error.errors.map(
          (e) => e.message
        )}`
      );
    }
    throw error;
  }
};

/**
 * Deletes a reservation by its Id.
 * @param {string} reservationId - The Id of the reservation to delete.
 * @throws {Error} If the request  fails, throws an error with details from the backend or a generic message.
 * @returns {Promise<void>} Resloves if the deleteion was successful.
 */
export const deleteReservation = async (
  reservationId: string
): Promise<void> => {
  if (!mongooseObjectIdValidationRegex.parse(reservationId))
    throw new Error("Invalid Reservation ID format.");

  const deletedReservation = await fetch(`${BASE_URL}/${reservationId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!deletedReservation.ok) {
    let errorMsg = `Failed to delete reservation from ${BASE_URL}/${reservationId} : ${deletedReservation.status}`;
    try {
      const errorData = await deletedReservation.json();
      if (errorData && errorData.message) {
        errorMsg += ` - ${errorData.message}`;
      }
    } catch {}
    throw new Error(errorMsg);
  }
};

/**
 * Confirms a reservation payment by its Id.
 * @param {string} reservationId - The Id of the reservation to confirm.
 * @throws {Error} If the request fails, throws an error with details from the backend or a generic message.
 * @returns {Promise<TReservationDisplay>} Resolves to the updated and validated reservation object.
 */
export const confirmReservationPayment = async (
  reservationId: string
): Promise<TReservationDisplay> => {
  if (!mongooseObjectIdValidationRegex.parse(reservationId))
    throw new Error("Invalid Reservation ID format.");

  const response = await fetch(`${BASE_URL}/${reservationId}/confirm`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    let errorMsg = `Failed to confirm reservation ${reservationId}: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMsg += ` - ${errorData.message}`;
      }
    } catch (error) {}
    throw new Error(errorMsg);
  }

  const reservationData = await response.json();
  try {
    return reservationDisplaySchema.parse(reservationData);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Reservation confirmation response validation failed: ${error.errors.map(
          (e) => e.message
        )}`
      );
    }
    throw error;
  }
};
