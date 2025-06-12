import React, { useState } from "react";
import MovieDetails from "./MovieDetails";
import Modal from "react-modal";
import styles from "./ShowMovie.module.css";
import type { Movie } from "../../validations/movie";

type ShowMovieProps = {
  movie: Movie;
  onRefresh?: () => void;
};

const ShowMovie: React.FC<ShowMovieProps> = ({ movie }) => {
  const [isShowingDetails, setIsShowingDetails] = useState(false);

  const handleToggleDetails = () => {
    setIsShowingDetails(!isShowingDetails);
  };

  return (
    <div className={styles.movieCard}>
      <div className={styles.imageContainer}>
        <img
          src={movie.imgURL}
          alt={movie.title}
          className={styles.movieImage}
          onError={(e) => e.currentTarget.src}
        />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.movieTitle}>{movie.title}</h3>
        <div className={styles.movieMeta}>
          <span className={styles.metaItem}>Year: {movie.year}</span>
          <span className={styles.metaItem}>Rating: {movie.pgRating}</span>
          <span className={styles.metaItem}>Genre: {movie.genre}</span>
        </div>
        <p className={styles.movieDescription}>
          {movie.description.length > 150
            ? `${movie.description.substring(0, 147)}...`
            : movie.description}
        </p>
        <div className={styles.cardActions}>
          <button
            onClick={handleToggleDetails}
            className={styles.detailsButton}
          >
            View Details
          </button>
        </div>
      </div>
      <Modal
        isOpen={isShowingDetails}
        onRequestClose={handleToggleDetails}
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        ariaHideApp={false}
      >
        <button onClick={handleToggleDetails} className={styles.closeButton}>
          &times;
        </button>
        <MovieDetails movie={movie} />
      </Modal>
    </div>
  );
};

export default ShowMovie;
