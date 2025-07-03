import { useEffect, useState } from "react";
import { type TMovie } from "../../validations";
import styles from "./Carousel.module.css";

type CarouselProps = {
  title: string;
  movies: TMovie[];
  intervalMs?: number;
};

const Carousel: React.FC<CarouselProps> = ({ title, movies, intervalMs = 5000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [movies.length, intervalMs]);

  if (!movies.length) return null;
  const movie = movies[index];

  return (
    <section className={styles.carouselSection}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.heroCarousel}>
        <img src={movie.imgURL} alt={movie.title} className={styles.heroImage} />
        <div className={styles.heroInfo}>
          <h3>{movie.title}</h3>
          <p className={styles.heroDescription}>{movie.description}</p>
          <span className={styles.heroYear}>{movie.year}</span>
        </div>
      </div>
      <div className={styles.dots}>
        {movies.map((_, i) => (
          <button
            key={i}
            className={i === index ? styles.activeDot : styles.dot}
            onClick={() => setIndex(i)}
            aria-label={`Show ${movies[i].title}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;