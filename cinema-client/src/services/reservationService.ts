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

export const fetchUserReservations = async(userId: string): Promise<TReservationDisplay[]> => {
  const reservations = await fetch(`${BASE_URL}/user/${userId}`, {
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
