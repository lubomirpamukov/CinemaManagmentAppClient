import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import type { TSeat } from "../validations/hall";
import { makeStyles } from "@mui/styles";
import SelecDateAndSeatQuantity from "../components/booking/SelectDateAndSeatQuantity";

import styles from "./BookingPage.module.css";
import SelectCityStep from "../components/booking/SelectCityStep";
import SelectCinemaAndSnacksStep, {
  type SelectedSnackInfo,
} from "../components/booking/SelectCinemaAndSnacksStep";

const useStyles = makeStyles(() => ({
  stepper: {
    "& .MuiStepIcon-root": {
      color: "var(--color-muted)",
    },
    "& .MuiStepIcon-root.Mui-active": {
      color: "var(--color-secondary)",
    },
    "& .MuiStepIcon-root.Mui-completed": {
      color: "var(--color-highlight)",
    },
  },
}));

const steps = [
  "Select City",
  "Select Cinema & Snacks",
  "Select Date",
  "Available Sessions",
  "Pick Your Seats",
  "Confirm Reservation",
];

type BookingData = {
  movieId?: string | null;
  city?: string | null;
  cinemaId?: string | null;
  date?: Date | null;
  numberOfSeats?: number;
  selectedSessionId?: string | null;
  selectedSeats?: TSeat[];
  selectedSnacks?: Record<string, SelectedSnackInfo>; // Added selectedSnacks
};

const BookingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    movieId: null,
    city: null,
    cinemaId: null,
    date: null,
    numberOfSeats: 1,
    selectedSessionId: null,
    selectedSeats: [],
    selectedSnacks: {},
  });

  const { movieId: routeMovieId } = useParams<{ movieId: string }>();

  useEffect(() => {
    if (routeMovieId) {
      setBookingData((prev) => ({ ...prev, movieId: routeMovieId }));
    }
  }, [routeMovieId]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setBookingData({
      movieId: bookingData.movieId,
      city: null,
      cinemaId: null,
      date: null,
      numberOfSeats: 1,
      selectedSessionId: null,
      selectedSeats: [],
      selectedSnacks: {},
    });
  };

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SelectCityStep
            movieId={bookingData.movieId!}
            selectedCity={bookingData.city!}
            onSelect={(city) =>
              updateBookingData({
                city,
                cinemaId: null,
                selectedSnacks: {},
                date: null,
                selectedSessionId: null,
                selectedSeats: [],
              })
            }
          />
        );
      case 1:
        return (
          <SelectCinemaAndSnacksStep
            movieId={bookingData.movieId!}
            city={bookingData.city!}
            selectedCinemaId={bookingData.cinemaId!}
            onCinemaSelect={(cinemaId) =>
              updateBookingData({
                cinemaId,
                selectedSnacks: {},
                date: null,
                selectedSessionId: null,
                selectedSeats: [],
              })
            }
            selectedSnacks={bookingData.selectedSnacks || {}}
            onSnacksUpdate={(updatedSnacks) =>
              updateBookingData({ selectedSnacks: updatedSnacks })
            }
          />
        );
      case 2:
        return (
          <SelecDateAndSeatQuantity 
            movieId={bookingData.movieId!}
            cinemaId={bookingData.cinemaId!}
            selectedDate={bookingData.date!}
            numberOfSeats={bookingData.numberOfSeats || 1}
            onDateChange={(date) => 
              updateBookingData({date,selectedSessionId: null, selectedSeats: []})
            }
            onSeatsChange={(seats) =>
              updateBookingData({
                numberOfSeats: seats,
                selectedSessionId: null,
                selectedSeats: []
              })
            }
          />
        );
      case 3:
        return (
          <Typography>
            Step 4: Display Available Sessions UI will go here.
          </Typography>
        );
      case 4:
        return (
          <Typography>Step 5: Seat Picker and UI will go here.</Typography>
        );
      case 5:
        return <Typography>Step 6: Confirmation UI will go here.</Typography>;
      default:
        return <Typography>Unknown step UI will go here.</Typography>;
    }
  };

  const classes = useStyles();

  return (
    <Paper elevation={3} className={styles.bookingContainer}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        className={styles.pageTitle}
      >
        Book Your Tickets
      </Typography>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className={classes.stepper}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box className={styles.contentBox}>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished (or show booking
              summary)
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset} className={styles.resetButton}>
                Reset
              </Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box
              sx={{
                mt: 2,
                mb: 2,
                p: 2,
                // border: "1px dashed grey", // You can keep or remove this styling
                borderRadius: "4px",
              }}
            >
              {getStepContent(activeStep)}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                variant="contained"
                disabled={activeStep === 0}
                onClick={handleBack}
                className={styles.navButton}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                variant="contained"
                onClick={handleNext}
                className={styles.navButton}
                // Add logic to disable Next if required fields for the current step are not filled
                // e.g. disabled={activeStep === 0 && !bookingData.city}
                // e.g. disabled={activeStep === 1 && !bookingData.cinemaId}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Paper>
  );
};

export default BookingPage;
