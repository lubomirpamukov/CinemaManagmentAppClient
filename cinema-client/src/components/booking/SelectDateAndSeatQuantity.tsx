import React from "react";
import { useAvailableDates } from "../../hooks";
import Spinner from "../Spinner";
import styles from "./SelectDateAndSeatQuantity.module.css";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";

import {
  parseISO,
  isValid,
  startOfDay,
} from "date-fns";

type SelectDateAndSeatQuantitiyProps = {
  movieId: string | null;
  cinemaId: string | null;
  selectedDate: Date | null;
  numberOfSeats: number;
  onDateChange: (date: Date | null) => void;
  onSeatsChange: (seats: number) => void;
};

const SelecDateAndSeatQuantity: React.FC<SelectDateAndSeatQuantitiyProps> = ({
  movieId,
  cinemaId,
  selectedDate,
  numberOfSeats,
  onDateChange,
  onSeatsChange,
}) => {
  const {
    availableDates,
    loading: datesLoading,
    error: datesError,
  } = useAvailableDates(movieId, cinemaId);

  //convert strings to date objects
  const availableDatesObjects = React.useMemo(() => {
    return availableDates
      .map((dateStr) => startOfDay(parseISO(dateStr))) // time part is zeroed out
      .filter((dateObj) => isValid(dateObj));
  }, [availableDates]);

  const shouldDisableDate = (date: Date): boolean => {
    if (availableDatesObjects.length === 0) {
      return true;
    }

    return !availableDatesObjects.some(
      (availableDate) => availableDate.getTime() === startOfDay(date).getTime()
    );
  };

  const getMinDate = (): Date | undefined => {
    return availableDatesObjects.length > 0
      ? availableDatesObjects[0]
      : undefined;
  };

  const getMaxDate = (): Date | undefined => {
    return availableDatesObjects.length > 0
      ? availableDatesObjects[availableDatesObjects.length]
      : undefined;
  };

  if (datesLoading) {
    return <Spinner size="medium" />;
  }

  if (datesError) {
    return <div>{datesError}</div>;
  }

  if (availableDates.length === 0 && !datesLoading) {
    return (
      <div className={styles.infoMessage}>
        No dates available for this selection.
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.container}>
        <div className={styles.dateSection}>
          <label htmlFor="booking-date-mui" className={styles.label}>
            Select Date:
          </label>
          <DatePicker
            label="Booking Date"
            value={selectedDate}
            onChange={(newDate: Date | null) => {
              onDateChange(newDate ? startOfDay(newDate) : null);
            }}
            shouldDisableDate={shouldDisableDate}
            minDate={getMinDate() ?? undefined}
            maxDate={getMaxDate() ?? undefined}
            disablePast
            slots={{ textField: TextField }}
            slotProps={{
              textField: {
                id: "booking-date-mui",
                className: styles.dateInputMui,
                fullWidth: true,
                helperText: "Only available dates are selectable",
              },
            }}
            enableAccessibleFieldDOMStructure={false}
          />
        </div>

        <div className={styles.seatsSection}>
          <label htmlFor="number-of-tickets" className={styles.label}>
            Number of Tickets:
          </label>
          <TextField
            type="number"
            id="number-of-tickets"
            value={numberOfSeats}
            onChange={(e) => {
              const seats = parseInt(e.target.value, 10);
              onSeatsChange(seats > 0 ? seats : 1);
            }}
            InputProps={{ inputProps: { min: 1 } }}
            className={styles.seatsInputMui}
            variant="outlined"
            size="small"
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default SelecDateAndSeatQuantity;
