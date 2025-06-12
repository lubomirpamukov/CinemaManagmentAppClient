import { useState } from "react";
import { z } from "zod";

import { useSearch, usePaginated, useDebounce } from "../hooks";
import Pagination from "../components/Pagination";
import { movieSchema } from "../validations";
import MovieList from "../components/movie/MovieList";
import styles from "./MoviesPage.module.css";
import SearchBar from "../components/SearchBar";

const MoviePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const debouncedSearchTerm = useDebounce(searchTerm, 600);

    const {
        data: movies,
        currentPage,
        totalPages,
        setCurrentPage,
        loading,
        error,
        refresh,
    } = usePaginated("/movies",
        3,
        z.array(movieSchema),
        debouncedSearchTerm
    );

    useSearch({ debouncedValue: debouncedSearchTerm, setCurrentPage });

    const handleSearchChange = (currentQuery: string) => {
        setSearchTerm(currentQuery);
    };

    if (error) {
        return <div>{error}</div>
    }

    return (
    <section className={styles.moviePage}>
      <header className={styles.moviePageHeader}>
        <h1>Movies</h1>
      </header>
      <main className={styles.moviePageContent}>
        <SearchBar
          onSearch={(e) => handleSearchChange(e)}
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
}

export default MoviePage;