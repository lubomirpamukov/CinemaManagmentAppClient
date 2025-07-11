import { useCallback, useMemo, useState } from "react";
import { useSearch, usePaginated, useDebounce } from "../hooks";
import Pagination from "../components/Pagination";
import { movieSchema } from "../validations";
import MovieList from "../components/movie/MovieList";
import styles from "./MoviesPage.module.css";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";

const MoviePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const [resetToken, setResetToken] = useState(0);

  const moveiFilters = useMemo(() => {
    const filters: Record<string, string | number | boolean | undefined> = {};
    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    };
    return filters
  }, [debouncedSearchTerm])


  const {
    data: movies,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    refresh,
  } = usePaginated("/movies", 3, movieSchema, moveiFilters, resetToken);

  const handleSearch = useCallback(() => {
    setResetToken(Date.now());
  }, []);

  useSearch({ debouncedValue: debouncedSearchTerm, onSearch: handleSearch });


  const handleSearchChange = (currentQuery: string) => {
    setSearchTerm(currentQuery);
  };

  if (loading && movies.length === 0) {
    return <Spinner size="large" className={styles.fullscreen}/>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className={styles.moviePage}>
      <header className={styles.moviePageHeader}>
        <h1>Movies</h1>
      </header>
      <main className={styles.moviePageContent}>
        <SearchBar
          onSearch={handleSearchChange}
          placeholder="Title, director, genre"
          className={styles.searchBar}
        />
        <MovieList movies={movies} loading={loading} refresh={refresh} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </section>
  );
};

export default MoviePage;
