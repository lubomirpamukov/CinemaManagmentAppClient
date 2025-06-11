import { z } from "zod";

//Constants
export const UserValidation = {
  name: "Name must be between 4 and 100 characters long.",
  email: "Email must be a valid email address and with maximum 100 chacaters.",
  password: "Password must be between 8 and 100 characters long.",
  contact: "Contact number must be a valid phone number.",
};

//User validation schema
export const userSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(4, UserValidation.name)
    .max(100, UserValidation.name)
    .optional(),
  email: z.string().email(UserValidation.email).max(100, UserValidation.email),
  password: z
    .string()
    .min(8, UserValidation.password)
    .max(100, UserValidation.password),
  contact: z.string().max(15, UserValidation.contact).optional(),
});
