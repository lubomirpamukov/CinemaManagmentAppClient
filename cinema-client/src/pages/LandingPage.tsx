import { useShowcase } from "../hooks";
import Carousel from "../components/movie/Carousel";
import styles from "./LandingPage.module.css";
import Spinner from "../components/Spinner";

const LandingPage: React.FC = () => {
  const { data, loading, error } = useShowcase();

  if (loading) return <Spinner size="large" />;
  if (error) return <div>{error}</div>;
  if (!data) return null;

  return (
    <div className={styles.layout}>
      <Carousel title="New Movies" movies={data.newMovies} />
      <Carousel title="Popular Movies" movies={data.popularMovies} />
      <Carousel title="Recommended Movies" movies={data.recommendedMovies} />
    </div>
  );
};

export default LandingPage;
