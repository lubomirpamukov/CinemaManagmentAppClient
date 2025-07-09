import { z } from "zod";

const mongooseObjectIdRegex = /^[a-fA-F0-9]{24}$/;
const PurchasedSnacksSchema = z.record(z.number());

export const createReservationSchema = z.object({
  userId: z
    .string()
    .regex(mongooseObjectIdRegex, { message: "Invalid userId format." }),
  sessionId: z
    .string()
    .regex(mongooseObjectIdRegex, { message: "Invalid sessionId format." }),
  seats: z.array(
    z.object({
      originalSeatId: z
        .string()
        .regex(mongooseObjectIdRegex, { message: "Invalid seatId format." }),
    })
  ),
  status: z.enum(["pending", "confirmed", "failed", "completed"]),
  purchasedSnacks: PurchasedSnacksSchema.optional(),
});

export type TCreateReservation = z.infer<typeof createReservationSchema>;

export const reservationDisplaySchema = z.object({
  _id: z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid reservation ID format." }),
  reservationCode: z.string(),
  userId: z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid reservation ID format." }),
  sessionId: z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid reservation ID format." }),
  status: z.enum(["pending", "confirmed", "failed", "completed"]),
  totalPrice: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  movieName: z.string(),
  hallName: z.string(),
  sessionStartTime: z.string(),
  sessionDate: z.string(),
  seats: z.array(
    z.object({
      seatNumber: z.string(),
      row: z.number(),
      column: z.number(),
      type: z.enum(["regular", "vip", "couple"]),
      price: z.number(),
    })
  ),
  purchasedSnacks: z.array(
    z.object({
      snackId: z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid snackId format." }),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
    })
  ),
});

export type TReservationDisplay = z.infer<typeof reservationDisplaySchema>;

export type TReservationFilters = {
  userId?: string;
  status?: ("pending" | "confirmed" | "failed" | "completed")[];
  // Add other potential filters here
};