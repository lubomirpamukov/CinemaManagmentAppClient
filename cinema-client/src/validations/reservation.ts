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
