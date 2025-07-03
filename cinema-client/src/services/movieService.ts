import { type TMovie, movieSchema, mongooseObjectIdValidationRegex, type ShowcaseMovies } from "../validations";

const BASE_URL = 'http://localhost:3123/movies';

export const fetchMovieById = async (movieId:string): Promise<TMovie> => {
    try {
        const validateMovieId = mongooseObjectIdValidationRegex.parse(movieId);
        if (!validateMovieId) throw new Error('Invalid Movie ID format.');
        const movieResponse = await fetch(`${BASE_URL}/${movieId}`,{
            method: "GET",
            credentials: "include"
        })
        if(!movieResponse.ok) throw new Error("Failed to fetch movie.");
        const moveiData = await movieResponse.json()
        const validatedMovie = movieSchema.parse(moveiData);
        return validatedMovie;
    } catch (err: any) {
        throw err;
    }
}

export const fetchShowcaseMovies = async(): Promise<ShowcaseMovies> => {
    
    const response = await fetch(`${BASE_URL}/showcase` ,{
        method: "GET",
        credentials: "include"
    })
    if (!response.ok) throw new Error("Failed to fetch showcase movies.");

    const movies = await response.json()
    return movies;
}