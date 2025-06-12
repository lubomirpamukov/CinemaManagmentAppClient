import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MovieDetails.module.css";
import type { Movie } from "../../validations";

type MovieDetailsProps = {
  movie: Movie;
};

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleBookTickets = () => {
    navigate(`/booking/${movie.id}`);
  };

  if (!movie) {
    return <div className={styles.loadingOrError}>Movie details not found</div>;
  }

  return (
    <div className={styles.movieDetailsContainer}>
      <div className={styles.mainContent}>
        <div className={styles.imageWrapper}>
          <img
            src={movie.imgURL}
            alt={movie.title}
            className={styles.movieImage}
            onError={(e) => e.currentTarget}
          />
        </div>
        <div className={styles.infoWrapper}>
          <h1 className={styles.title}>{movie.title}</h1>
          <div className={styles.metaInfo}>
            <span>{movie.year}</span>
            <span>&bull;</span>
            <span>{movie.pgRating}</span>
            <span>&bull;</span>
            <span>{movie.duration} min</span>
          </div>
          <div className={styles.genres}>
            <span className={styles.label}>Genre:</span>
            <span>{movie.genre}</span>
          </div>
          <div className={styles.director}>
            <span className={styles.label}>Director:</span>
            <span>{movie.director}</span>
          </div>

          <p className={styles.description}>{movie.description}</p>

          <button onClick={handleBookTickets} className={styles.bookButton}>
            Book Tickets
          </button>
        </div>
      </div>

      {movie.cast && movie.cast.length > 0 && (
        <div className={styles.castSection}>
          <h2 className={styles.sectionTitle}>Cast</h2>
          <div className={styles.castGrid}>
            {movie.cast.map((member, index) => (
              <div key={index} className={styles.castMemberCard}>
                <p className={styles.castMemberName}>{member.name}</p>
                <p className={styles.castMemberRole}>as {member.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
