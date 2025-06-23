import React from "react";

import ShowMovie from "./ShowMovie";
import styles from "./MovieList.module.css";
import type { TMovie } from "../../validations";
// to do import spinner;

type MovieListProps = {
  movies: TMovie[];
  loading: boolean;
  refresh: () => void;
};

const MovieList: React.FC<MovieListProps> = ({ movies, refresh, loading }) => {
  if (loading) {
    return; // to do spinner;
  }

  if (!movies || movies.length === 0) {
    return <div className={styles.emptyMessage}>No movies found.</div>;
  }

  return (
    <React.Fragment>
      <div className={styles.movieList}>
        {movies.map((movie) => (
          <ShowMovie key={movie.id} movie={movie} onRefresh={refresh} />
        ))}
      </div>
    </React.Fragment>
  );
};

export default MovieList