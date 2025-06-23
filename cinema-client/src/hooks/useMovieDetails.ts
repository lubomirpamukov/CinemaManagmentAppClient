import { useState, useEffect } from "react";
import { fetchMovieById } from "../services";
import { type TMovie } from "../validations";

export const useMovieDetails = (movieId?: string | null) => {
    const [movie, setMovie] = useState<TMovie | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!movieId) {
            setMovie(null);
            return;
        }
        setLoading(true);
        fetchMovieById(movieId)
        .then(setMovie)
        .catch((err) => setError(err.message || "Failed to fetch movie"))
        .finally(() => setLoading(false))
    }, [movieId]);

    return { movie, loading, error};
}