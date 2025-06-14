import { z } from 'zod';
import { snackSchema } from './snack';

export const CinemaValidation = {
    city: 'City must be between 3 and 150 characters long.',
    name: 'Cinema must be between 4 and 100 characters long.',
    snackName: 'Name must be between 2 and 100 character long.',
    snackDescription: 'Description must be between 1 and 300 characters long.',
    snackPrice: 'Price must be between 0.10 and 1000',
    url: 'Image URL must be valid URL.'
};

export const cinemaSchema = z.object({
    id: z.string().optional(),
    city: z.string().min(3, CinemaValidation.city).max(150, CinemaValidation.city),
    name: z.string().min(4, CinemaValidation.name).max(100, CinemaValidation.name),
    halls: z.array(z.string()),
    snacks: z.array(snackSchema),
    imgURL: z
        .string()
        .url({ message: CinemaValidation.url })
        .optional()
        .or(z.literal('').transform(() => undefined))
});

export type TCinema = z.infer<typeof cinemaSchema>;