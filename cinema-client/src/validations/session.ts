import { z } from 'zod';

export const SessionConstants = {
    cinemaId: 'Cinema is required.',
    hallId: 'Hall is required.',
    movieId: 'Movie is required.',
    date: 'Date is required.',
    time: 'Time is required.'
};

export const sessionSchema = z.object({
    _id: z.string().optional(),
    cinemaId: z.string().min(1, SessionConstants.cinemaId),
    hallId: z.string().min(1, SessionConstants.hallId),
    movieId: z.string().min(1, SessionConstants.movieId),
    date: z.string().min(1, SessionConstants.date),
    startTime: z.string().min(1, SessionConstants.time),
    endTime: z.string().min(1, SessionConstants.time)
});

export type TSession = z.infer<typeof sessionSchema>;