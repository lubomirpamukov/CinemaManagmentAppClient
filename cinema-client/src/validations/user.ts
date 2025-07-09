import { z } from "zod";

//Constants
export const UserValidation = {
    name: 'Name must be between 4 and 100 characters long.',
    email: 'Email must be a valid email address and with maximum 100 chacaters.',
    password: 'Password must be between 8 and 100 characters long.',
    contact: 'Contact number must be a valid phone number.',
    adress: 'Address line1 is required.',
    city: 'City is required.' ,
    state: 'State is required.' ,
    zipcode: 'Zipcode is required.'
};

const addressSchema = z.object({
    line1: z.string().min(1, UserValidation.adress).optional(),
    city: z.string().min(1, UserValidation.city).optional(),
    state: z.string().min(1, UserValidation.state).optional(),
    zipcode: z.string().min(1, UserValidation.zipcode).optional()
});

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
  address: addressSchema.optional()
});

export const userResponseSchema = userSchema.omit({ password: true});
export type TUserResponse = z.infer<typeof userResponseSchema>;

export type TUser = z.infer<typeof userSchema>;

// schema for updating user details
export const profileDetailsSchema = userSchema.pick({ name: true, email: true, contact: true, address: true});
export type TProfileDetails = z.infer<typeof profileDetailsSchema>;


// schmea for changing the Password
export const changePasswordSchema = z.object({
  password: z.string().min(8, UserValidation.password).max(100, UserValidation.password),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Password do not match",
  path: ["confirmPassword"]
})
export type TChangePassword = z.infer<typeof changePasswordSchema>;
