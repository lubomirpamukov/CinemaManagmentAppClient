import { type TCreateReservation, type TReservationDisplay } from "../validations";
const BASE_URL = "http://localhost:3123/reservation";
export const createReservation = async (
  reservationData: TCreateReservation
) => {
  //to do add return type
  const createReservation = await fetch(BASE_URL, {
    method: "POST",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(reservationData),
  });

  if (!createReservation.ok) throw new Error("Failed to create Reservation.");
  return createReservation.json();
};

export type TReservationFilters = {
  userId?: string;
  status?: ("pending" | "confirmed" | "failed" | "completed")[];
  // Add other potential filters here
};

export const fetchUserReservations = async(filters: TReservationFilters): Promise<TReservationDisplay[]> => {
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
      "Content-Type": "application/json"
    },
  });

  if (!reservations.ok) {
    let errorMsg = "Failed to delete reservation.";
    try {
      const errorData = await reservations.json();
      errorMsg = errorData.error || errorMsg;
    } catch{}
    throw new Error(errorMsg);
  }
  return reservations.json();
}

export const deleteReservation = async (reservationId: string): Promise<void> => {
  const deletedReservation = await fetch(`${BASE_URL}/${reservationId}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!deletedReservation.ok) {
    let errorMsg = "Failed to delete reservation.";
    try {
      const errorData = await deletedReservation.json();
      errorMsg = errorData.error || errorMsg;
    } catch{}
    throw new Error(errorMsg);
  }
}

export const confirmReservationPayment = async (reservationId: string): Promise<TReservationDisplay> => {
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
