import { z } from "zod";
import { mongooseObjectIdValidationRegex } from "./session";

// constants
export const HallValidation = {
  name: "Hall name must be between 3 and 100 characters long",
  layoutRows: "Rows must be between 1 and 50",
  layoutColumns: "Columns must be between 1 and 50",
  price: "Price must be a positive number",
  seats:
    "All seats must be within the rows and columns range of the hall layout",
  seatName: "Seat name must be between 1 and 10 characters long",
  movieOverlap: "Movie times cannot overlap",
};

//schemas
export const seatsSchema = z.object({
  _id: z.string().optional(),
  row: z.number(),
  column: z.number(),
  seatNumber: z
    .string()
    .min(1, HallValidation.seatName)
    .max(10, HallValidation.seatName),
  isAvailable: z.boolean().optional(),
  type: z.enum(["regular", "vip", "couple"]),
  price: z.number().min(0, HallValidation.price),
});

export const sessionSeatLayoutSchema = z.object({
  sessionId: mongooseObjectIdValidationRegex,
  hallId: mongooseObjectIdValidationRegex,
  hallName: z.string().min(3, HallValidation.name),
  hallLayout: z.object({
    rows: z.number().int().positive(),
    columns: z.number().int().positive(),
  }),
  seats: z.array(seatsSchema),
})

//types
export type TSessionSeatLayout = z.infer<typeof sessionSeatLayoutSchema>;
export type THallSeat = z.infer<typeof seatsSchema>;
