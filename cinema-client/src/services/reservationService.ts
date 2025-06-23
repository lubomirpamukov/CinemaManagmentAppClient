import { type TCreateReservation, type TReservationDisplay } from "../validations";
const BASE_URL = "http://localhost:3123/reservation";
export const createReservation = async (
  reservationData: TCreateReservation
) => {
  //to do add return type
  console.log(reservationData)
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

  if (!reservations.ok) throw new Error("Failed to fetch user reservations.");
  return reservations.json();
}
