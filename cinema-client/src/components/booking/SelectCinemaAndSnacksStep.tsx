import React, { useMemo } from "react";
import { useMovieCinemas } from "../../hooks/useMovieCinemas";
import type { TCinema, TSnack } from "../../validations";
import Spinner from "../Spinner";
import styles from "./SelectCinemaAndSnacksStep.module.css";
import SnacksSelection from "./SnacksSelection";

export type SelectedSnackInfo = {
  // This type might be better in a shared types file
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

type SelectCinemaAndSnacksStepProps = {
  movieId: string | null;
  city: string | null;
  selectedCinemaId: string | null;
  onCinemaSelect: (cinemaId: string, cinemaName: string) => void;
  selectedSnacks: Record<string, SelectedSnackInfo>;
  onSnacksUpdate: (updatedSnacks: Record<string, SelectedSnackInfo>) => void;
};

const SelectCinemaAndSnacksStep: React.FC<SelectCinemaAndSnacksStepProps> = ({
  movieId,
  city,
  selectedCinemaId,
  onCinemaSelect,
  selectedSnacks,
  onSnacksUpdate,
}) => {
  const {
    cinemas,
    loading: cinemasLoading,
    error: cinemasError,
  } = useMovieCinemas(movieId, city);

  const selectedCinemaDetails = useMemo(() => {
    return cinemas.find((c) => c.id === selectedCinemaId) || null;
  }, [cinemas, selectedCinemaId]);

  const handleSnackQuantityChange = (snack: TSnack, quantity: number) => {
    const newQuantity = Math.max(0, quantity);
    const updated = { ...selectedSnacks };
    if (newQuantity === 0) {
      delete updated[snack._id!];
    } else {
      updated[snack._id!] = {
        _id: snack._id!,
        name: snack.name,
        price: snack.price,
        quantity: newQuantity,
      };
    }
    onSnacksUpdate(updated);
  };

  const totalSnackCost = useMemo(() => {
    return Object.values(selectedSnacks).reduce(
      (total, snack) => total + snack.price * snack.quantity,
      0
    );
  }, [selectedSnacks]);

  if (!movieId || !city) {
    /* ... cinema loading/error/empty states ... */
  }
  if (cinemasLoading) return <Spinner size="medium" />;
  if (cinemasError)
    return (
      <div className={styles.errorMessage}>
        Error loading cinemas: {cinemasError}
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.cinemaSelectSection}>
        <select
          id="cinema-select"
          className={styles.selectStyle}
          value={selectedCinemaId || ""}
          onChange={(e) => {
            const selected = cinemas.find((c) => c.id === e.target.value);
            onCinemaSelect(e.target.value, selected ? selected.name : "");
          }}
          disabled={!cinemas || cinemas.length === 0}
        >
          <option className={styles.placeholderOptionStyle} value="" disabled>
            -- Choose a cinema --
          </option>
          {cinemas.map((cinema: TCinema) => (
            <option
              className={styles.optionStyle}
              key={cinema.id}
              value={cinema.id}
            >
              {cinema.name}
            </option>
          ))}
        </select>
        {cinemas && cinemas.length === 0 && !cinemasLoading && (
          <div className={styles.infoMessage}>
            No cinemas found for this selection.
          </div>
        )}
      </div>

      {selectedCinemaDetails && (
        <SnacksSelection
          availableSnacks={selectedCinemaDetails.snacks || []}
          selectedSnacks={selectedSnacks}
          onSnackQuantityChange={handleSnackQuantityChange}
          totalSnackCost={totalSnackCost}
        />
      )}
    </div>
  );
};

export default SelectCinemaAndSnacksStep;
