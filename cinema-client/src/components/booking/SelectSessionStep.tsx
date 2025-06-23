import React, { useMemo } from "react";
import { format } from "date-fns";
import { useFilteredSessions } from "../../hooks";
import type { FetchBookingsSessionParams } from "../../services";
import type { TSessionDisplay } from "../../validations";
import Spinner from "../Spinner";
import styles from "./SelectSessionStep.module.css";

type SelectSessionStepProps = {
  movieId?: string | null;
  cinemaId?: string | null;
  date?: Date | null;
  numberOfSeats?: number;
  selectedSessionId?: string | null;
  onSessionSelect: (
    sessionId: string,
    hallName: string,
    startTime: string
  ) => void;
};

const SelectSessionStep: React.FC<SelectSessionStepProps> = ({
  movieId,
  cinemaId,
  date,
  numberOfSeats,
  selectedSessionId,
  onSessionSelect,
}) => {
  const sessionFilters = useMemo((): FetchBookingsSessionParams => {
    const filters: FetchBookingsSessionParams = {
      page: 1,
      limit: 999, // making it display all sessions in single page becouse useFilteredSessions returns paginated result
    };

    if (movieId) filters.movieId = movieId;
    if (cinemaId) filters.cinemaId = cinemaId;
    if (date) filters.date = format(date, "yyyy-MM-dd");
    if (numberOfSeats && numberOfSeats > 0)
      filters.minSeatsRequired = numberOfSeats;
    return filters;
  }, [movieId, cinemaId, date, numberOfSeats]);

  const { sessions, loading, error } = useFilteredSessions(sessionFilters);

  if (loading) {
    return <Spinner size="medium" />;
  }

  if (error) {
    return (
      <div className={`${styles.statusContainer} ${styles.errorContainer}`}>
        <p>Error loading sessions: {error}</p>
        <p>
          Please try selecting a different date or ensure all previous steps are
          completed correctly.
        </p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className={styles.statusContainer}>
        <p>No sessions available for the selected criteria.</p>
        <p>Please try a different date or number of seats.</p>
      </div>
    );
  }

  return (
    <div className={styles.sessionsContainer}>
      <h3 className={styles.stepTitle}>
        Available Sessions for{" "}
        {date ? format(date, "MMMM d, yyyy") : "selected date"}
      </h3>
      <div className={styles.sessionsGrid}>
        {sessions.map((session: TSessionDisplay) => (
          <button
            key={session._id}
            type="button"
            className={`${styles.sessionItem} ${
              selectedSessionId === session._id ? styles.selected : ""
            }`}
            onClick={() =>
              onSessionSelect(
                session._id!,
                session.hallName || "Main Hall",
                session.startTime
              )
            }
            aria-pressed={selectedSessionId === session._id}
          >
            <div className={styles.sessionTime}>{session.startTime}</div>
            <div className={styles.sessionHall}>
              {session.hallName || "Main Hall"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectSessionStep;
