import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { useSearch, usePaginated, useDebounce } from "../hooks";
import Pagination from "../components/Pagination";
import { movieSchema } from "../validations";
import MovieList from "../components/movie/MovieList";
import styles from "./MoviesPage.module.css";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";

const MoviePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const moveiFilters = useMemo(() => {
    const filters: Record<string, string | number | boolean | undefined> = {};
    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    };
    return filters
  }, [debouncedSearchTerm])

  const paginatedMovieSchema = useMemo(() => z.array(movieSchema), []);

  const {
    data: movies,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    refresh,
  } = usePaginated("/movies", 3, paginatedMovieSchema, moveiFilters);

  useSearch({ debouncedValue: debouncedSearchTerm, setCurrentPage });


  const handleSearchChange = (currentQuery: string) => {
    setSearchTerm(currentQuery);
  };

  if (loading) {
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
