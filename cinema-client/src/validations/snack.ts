import { z } from "zod";

export const SnackValidation = {
  snackName: "Snack name must be between 1 and 100 characters",
  snackDescription: "Snack description must be between 1 and 300 characters",
  snackPrice: "Snack price must be between 0.10 and 1000",
  snackRequired: "At least one snack is required",
};

export const snackSchema = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(1, SnackValidation.snackName)
    .max(100, SnackValidation.snackName),
  description: z
    .string()
    .min(1, SnackValidation.snackDescription)
    .max(300, SnackValidation.snackDescription)
    .optional(),
  price: z
    .number()
    .min(0.1, SnackValidation.snackPrice)
    .max(1000, SnackValidation.snackPrice),
});

export type TSnack = z.infer<typeof snackSchema>;
